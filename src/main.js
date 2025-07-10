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
};

export let render = function(state) {
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
    showBackButton: false,
  });

}

async function main() {
  state.loading = true;
  state.categoriesLoading = true;
  render(state);
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({}), getCategories()]);

  store.setState({
    categories
  })
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
        router.navigateTo(
          `/category1=${encodeURIComponent(category1)}&category2=${encodeURIComponent(category2)}`
        );
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
}

// 렌더 후마다 핸들러 재연결
const originalRender = render;
render = function(...args) {
  const result = originalRender.apply(this, args);
  attachEventListeners();
  return result;
};