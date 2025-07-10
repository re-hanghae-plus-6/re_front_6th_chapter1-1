import { getCategories, getProducts } from "../api/productApi.js";
import { Filter } from "../components/filter/Filter.js";
import { Layout } from "../components/layout/Layout.js";
import { ProductList } from "../components/product/ProductList.js";
import initializeHandlers from "../handlers/index.js";
import { state } from "../@store/store.js";

export const Home = () => {
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
    children: `
      ${filterSection}
      ${productSection}
    `,
  });

  initializeHandlers(state, render);
}
