import FilterSection from "./components/filter/FilterSection.js";
import MainLayout from "./components/layout/MainLayout.js";
import ProductGrid from "./components/product/ProductGrid.js";
import { getProduct, getProducts, getCategories } from "./api/productApi.js";
import router from "./utils/router.js";
import ProductDetail from "./components/detail/ProductDetail.js";
import { setupInfiniteScroll } from "./utils/infiniteScroll.js";
import { Errorpage } from "./components/Errorpage.js";

// const , let 차이점
// const -> 값을 변경(재할당) 할 수 없음 , let -> 값을 변경(재할당) 할 수 있음.
export const state = {
  products: [],
  total: 0,
  loading: false,
  categories: [],
  categoriesLoading: false,
  searchValue: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",
  selectedLimit: 20,
  currentPage: 1,
  isLoadingMore: false,
  hasNext: true,
  cartCount: 0,
};

export let render = async function (state) {
  const rootDOM = document.body.querySelector("#root");
  const path = window.location.pathname;
  // 정규식: /product/... 또는 /front_6th_chapter1-1/product/... 모두 매치
  const detailPage = path.match(/(?:\/front_6th_chapter1-1)?\/product\/([^/]+)/);
  let html;

  if (
    path === "/" ||
    path === "" ||
    path.includes("limit") ||
    path.includes("sort") ||
    path.includes("search") ||
    (path.includes("front_6th_chapter1") && detailPage === null) ||
    path.includes("category")
  ) {
    html = MainLayout({
      content: `
        ${FilterSection({
          searchValue: state.searchValue,
          categories: state.categories,
          selectedCategory1: state.selectedCategory1,
          selectedCategory2: state.selectedCategory2,
          sort: state.selectedSort,
          limit: state.selectedLimit,
          loading: state.categoriesLoading,
        })}
        ${ProductGrid({
          products: state.products,
          total: state.total,
          loading: state.loading,
          hasNext: state.hasNext,
        })}
        `,
      cartCount: state.cartCount,
      showBackButton: false,
      title: "쇼핑몰",
    });
  } else if (detailPage) {
    const productId = path.split("/")[2];
    const product = await getProduct(productId);
    state.productDetail = product;

    html = MainLayout({
      content: `${ProductDetail({ productInfo: product })}`,
      cartCount: state.cartCount,
      showBackButton: true,
      title: "상품 상세",
    });
  } else {
    html = MainLayout({
      content: `${Errorpage()}`,
      title: "쇼핑몰",
    });
  }
  rootDOM.innerHTML = html;
};

async function main() {
  state.loading = true;
  state.categoriesLoading = true;
  state.cartCount = localStorage.getItem("cartCount");
  render(state);
  const path = window.location.pathname;
  if (path.includes("sort")) {
    const sortMatch = path.match(/sort=([^&/]+)/);
    if (sortMatch) {
      state.selectedSort = sortMatch[1];
    }
  }
  if (path.includes("limit")) {
    const limitMatch = path.match(/limit=([^&/]+)/);
    if (limitMatch) {
      state.selectedLimit = limitMatch[1];
    }
  }
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({ sort: state.selectedSort, limit: state.selectedLimit }), getCategories()]);

  // store.setState({
  //   products,
  //   total,
  //   categories,
  // });
  state.products = products;
  state.total = total;
  state.loading = false;
  state.categories = categories;
  state.categoriesLoading = false;
  render(state);
}

// 애플리케이션 시작
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

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
      (state.selectedCategory1 = e.target.getAttribute("data-category1")), (state.selectedCategory2 = "");

      if (e.target.matches("[data-category1]:not([data-category2])")) {
        const category1 = e.target.getAttribute("data-category1");
        router.navigateTo(`/category1=${encodeURIComponent(category1)}`);
      }
    };
  });

  // 카테고리2
  document.querySelectorAll("[data-category2]").forEach((btn) => {
    btn.onclick = (e) => {
      state.selectedCategory1 = e.target.getAttribute("data-category1");
      state.selectedCategory2 = e.target.getAttribute("data-category2");

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
      (state.selectedCategory1 = e.target.getAttribute("data-category1")), (state.selectedCategory2 = "");
    };
  }

  // 개수 옵션(페이지당 상품 수) 변경 시 라우터 이동
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.onchange = (e) => {
      const newLimit = e.target.value;
      fetchProducts({ limit: newLimit, page: state.currentPage });
      state.selectedLimit = Number(newLimit);

      // 현재 선택된 카테고리, 정렬, 검색어 등 상태값을 가져와서 쿼리스트링 구성
      router.navigateTo(`/limit=${encodeURIComponent(state.selectedLimit)}`);
    };
  }

  // 개수 옵션(페이지당 상품 수) 변경 시 라우터 이동
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      const newSort = e.target.value;
      state.selectedSort = newSort;
      fetchProducts({ sort: state.selectedSort, page: state.currentPage });
      router.navigateTo(`/sort=${encodeURIComponent(state.selectedSort)}`);
    };
  }

  // 상품명 검색 입력 필드(Enter 키로 검색)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      const searchValue = e.target.value.trim();
      if (searchValue !== "") {
        if (e.key === "Enter") {
          fetchProducts({ search: searchValue, page: state.currentPage });
          state.searchValue = searchValue;

          router.navigateTo(`/search=${encodeURIComponent(searchValue)}`);
        }
      }
    });

    document.body.addEventListener("click", (e) => {
      if (!e._productLinkHandled) {
        const link = e.target.closest("[data-product-link]");
        if (link) {
          e.preventDefault();
          e._productLinkHandled = true;
          const productId = link.getAttribute("data-product-link");

          router.navigateTo(`/product/${productId}`);
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
        // store.setState({ cartCount: newCartCount });
        // const state = store.getState();
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

const fetchProducts = async ({ limit = 20, sort = "price_asc", search = "", page = 1 }) => {
  state.loading = true;
  state.isLoadingMore = true;
  try {
    const {
      products,
      pagination: { total, page: currentPage, hasNext },
    } = await getProducts({
      limit,
      sort,
      search,
      page,
    });
    if (state.currentPage !== currentPage) {
      state.products = [...state.products, ...products];
    } else {
      state.products = products;
      state.loading = false;
    }
    state.isLoadingMore = false;
    state.total = total;
    state.currentPage = currentPage;
    state.hasNext = hasNext;
    state.selectedSort = sort;
    state.selectedLimit = limit;
    render(state);
  } catch (error) {
    state.loading = false;
    console.log(error);
  }
};

const setupProductInfiniteScroll = () => {
  return setupInfiniteScroll({
    onLoadMore: () => {
      // 바닥에 갔을 떄 실행할 것
      fetchProducts({
        limit: state.selectedLimit,
        sort: state.selectedSort,
        search: state.searchValue,
        page: Number(state.currentPage) + 1,
      });
      // const currentParams = getURLParams(defaultParams);
      // loadMoreProducts(currentParams);
    },
    threshold: 100,
    shouldLoad: () => {
      // 더 이상 부를게 있는지 결정
      return !state.isLoadingMore && state.hasNext;
    },
  });
};
setupProductInfiniteScroll();
