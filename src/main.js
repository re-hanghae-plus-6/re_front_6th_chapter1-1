import MainLayout from "./components/layout/MainLayout.js";
import FilterSection from "./components/filter/FilterSection.js";
import ProductGrid from "./components/product/ProductGrid.js";
import { getProducts, getCategories } from "./api/productApi.js";

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

function render(state, cartCount) {
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
    cartCount,
    showBackButton: false,
  });
}

async function main({ cartCount = 0 }) {
  state.loading = true;
  render(state, cartCount);
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({}), getCategories()]);

  state.products = products;
  state.total = total;
  state.loading = false;
  state.categories = categories;
  render(state, cartCount);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
