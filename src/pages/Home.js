import { getCategories, getProducts } from "../api/productApi.js";
import { Filter } from "../components/filter/Filter.js";
import { Layout } from "../components/layout/Layout.js";
import { ProductList } from "../components/product/ProductList.js";
import initializeHandlers from "../handlers/index.js";
import { state } from "../@store/store.js";

export const Home = () => {
  // 새로고침해도 유지되게 URL 쿼리에서 상태 초기화
  const params = new URLSearchParams(window.location.search);

  state.selectedLimit = params.get("limit") || "20";

  state.selectedSort = params.get("sort") || "price_asc";
  state.search = params.get("search") || "";
  state.selectedCategory1 = params.get("category1") || null;
  state.selectedCategory2 = params.get("category2") || null;
  state.isLoading = true;

  async function init() {
    render();

    const [categoryData, productData] = await Promise.all([
      getCategories(),
      getProducts({
        limit: parseInt(state.selectedLimit),
        search: state.search,
        category1: state.selectedCategory1,
        category2: state.selectedCategory2,
        sort: state.selectedSort,
      }),
    ]);

    state.products = productData.products;
    state.total = productData.pagination.total;
    state.categories = categoryData;
    state.isLoading = false;

    render();
  }

  init();

  //배포 테스트
};

function render() {
  const filterSection = Filter({
    selectedLimit: state.selectedLimit,
    selectedSort: state.selectedSort,
    categories: state.categories,
    search: state.search,
    isLoading: state.isLoading,
  });
  const productSection = ProductList({ products: state.products, total: state.total, isLoading: state.isLoading });
  document.body.querySelector("#root").innerHTML = Layout({
    children: /* HTML */ ` ${filterSection} ${productSection} `,
  });

  initializeHandlers(state, render);
}
