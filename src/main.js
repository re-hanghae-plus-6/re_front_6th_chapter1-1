import FilterSection from "./components/filter/FilterSection.js";
import MainLayout from "./components/layout/MainLayout.js";
import ProductGrid from "./components/product/ProductGrid.js";
import { getProducts, getCategories } from "./api/productApi.js";
import store from "./store/store.js";
import router from "./utils/router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// const , let 차이점
// const -> 값을 변경(재할당) 할 수 없음 , let -> 값을 변경(재할당) 할 수 있음.
const state = {
  products: [],
  total: 0,
  loading: false,
  categories: [],
  categoriesLoading: false,
  searchValue: "",
  selectCategory1: "",
  selectCategory2: "",
  selectedSort: "price_asc",
  selectedLimit: "20",
  currentPage: 1,
  hasMore: true,
  cartCount: 0,
};

export let render = function (state) {
  const rootDOM = document.body.querySelector("#root");
  rootDOM.innerHTML = MainLayout({
    content: `
      ${FilterSection({
        searchValue: state.searchValue,
        categories: state.categories,
        selectedCategory1: state.selectCategory1,
        selectedCategory2: state.selectCategory2,
        sort: state.selectedSort,
        limit: state.selectedLimit,
        loading: state.categoriesLoading,
      })}
      ${ProductGrid({
        products: state.products,
        total: state.total,
        loading: state.loading,
        hasMore: state.hasMore,
      })}
      `,
      cartCount: state.cartCount,
  });
};

async function main() {
  state.loading = true;
  state.categoriesLoading = true;
  state.cartCount = localStorage.getItem("cartCount");
  render(state);
  
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([
    getProducts({}),
    getCategories(),
  ]);

  store.setState({
    products,
    total,
    categories,
  });
  state.products = products;
  state.total = total;
  state.loading = false;
  state.categories = categories;
  state.categoriesLoading = false;
  render(state);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

function attachEventListeners() {
  // 렌더링 후에도 동작하도록 이벤트 위임 사용

  // 카테고리1
  document.querySelectorAll("[data-category1]:not([data-category2])").forEach((btn) => {
    btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: "",
        currentPage: 1,
      });
      if (e.target.matches("[data-category1]:not([data-category2])")) {
        const category1 = e.target.getAttribute("data-category1");
        router.navigateTo(`/category1=${encodeURIComponent(category1)}`);
      }
    };
  });

  // 카테고리2
  document.querySelectorAll("[data-category2]").forEach((btn) => {
    btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: e.target.getAttribute("data-category2"),
        currentPage: 1,
      });
      // 2depth 카테고리
      if (e.target.matches("[data-category2]")) {
        const category1 = e.target.getAttribute("data-category1");
        const category2 = e.target.getAttribute("data-category2");
        router.navigateTo(`/category1=${encodeURIComponent(category1)}&category2=${encodeURIComponent(category2)}`);
      }
    };
  });

  // 브레드크럼 category1
  const bcCategory1Btn = document.querySelector("[data-breadcrumb='category1']");
  if (bcCategory1Btn) {
    bcCategory1Btn.onclick = (e) => {
      // getAttribute가 null일 때 부모 노드에서 찾도록 보완
      let category1 = e.target.getAttribute("data-category1");
      if (!category1 && e.target.closest("[data-category1]")) {
        category1 = e.target.closest("[data-category1]").getAttribute("data-category1");
      }
      if (category1) {
        router.navigateTo(`/category1=${encodeURIComponent(category1)}`);
      }
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: "",
        currentPage: 1,
      });
    };
  }
  
  // 개수 옵션(페이지당 상품 수) 변경 시 라우터 이동
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.onchange = (e) => {
      const newLimit = e.target.value;
      fetchProducts({ limit: newLimit });
      store.setState({
        limit: Number(newLimit),
        currentPage: 1,
      });

      // 현재 선택된 카테고리, 정렬, 검색어 등 상태값을 가져와서 쿼리스트링 구성
      const state = store.getState();
      router.navigateTo(`/limit=${encodeURIComponent(state.limit)}`);
    };
  }

  // 개수 옵션(페이지당 상품 수) 변경 시 라우터 이동
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      const newSort = e.target.value;
      fetchProducts({ sort: newSort });
      store.setState({
        sort: newSort,
        currentPage: 1,
      });
      // 현재 선택된 카테고리, 정렬, 검색어 등 상태값을 가져와서 쿼리스트링 구성
      const state = store.getState();
      
      router.navigateTo(`/sort=${encodeURIComponent(state.sort)}`);
    };
  }


  // 상품명 검색 입력 필드(Enter 키로 검색)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      const searchValue = e.target.value.trim();
        if (searchValue !== "") {
        if (e.key === "Enter") {

          fetchProducts({ search: searchValue });
          store.setState({
            searchValue,
            currentPage: 1,
          });

          router.navigateTo(`/search=${encodeURIComponent(searchValue)}`);
        }
      }
    });
  }

  // 장바구니 담기 버튼 클릭 시 cartCount 증가
  // 이벤트 위임 방식으로, 클릭된 버튼 하나에 대해서만 동작하게 처리
  // 기존 cartContainer 이벤트 리스너가 중복 등록되는 문제 방지
  const cartContainer = document.getElementById("product-list") || document.body;
  if (cartContainer._cartListenerAttached !== true) {
    cartContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart-btn");
      if (btn) {
        e.preventDefault();
        let cartCount = Number(localStorage.getItem("cartCount")) || 0;
        const newCartCount = cartCount + 1;
        localStorage.setItem("cartCount", newCartCount);
        store.setState({ cartCount: newCartCount });
        const state = store.getState();
        render(state);
      }
    });
    cartContainer._cartListenerAttached = true;
  }

}

// 렌더 후마다 핸들러 재연결
const originalRender = render;
render = function (...args) {
  const result = originalRender.apply(this, args);
  attachEventListeners();
  return result;
};

const fetchProducts = async ({ limit = 20, sort = "price_asc", search = "" }) => {
  state.loading = true;

  try {
    const { 
      products,
      pagination: { total },
    } = await getProducts({
      limit,
      sort,
      search,
    });
    state.products = products;
    state.total = total;
    state.loading = false;
    render(state);
  } catch (error) {
    state.loading = false;
    console.log(error);
  }
};