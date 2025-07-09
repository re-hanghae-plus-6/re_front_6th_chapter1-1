import { getCategories, getProducts } from "../api/productApi.js";
import { Filter } from "../components/filter/Filter.js";
import { Layout } from "../components/layout/Layout.js";
import { ProductList } from "../components/product/ProductList.js";
import initializeHandlers from "../handlers/index.js";

let state = {
  page: 1,
  products: [],
  categories: [],
  total: 0,
  isLoading: true,
  selectedLimit: "20",
  allLoaded: false,
  cart: [],
  search: "",
  selectedCategory1: "",
  selectedCategory2: "",
  selectedSort: "price_asc",
  cartCount: 0,

  selectProduct: null,
};

export const Home = () => {
  async function init() {
    document.body.querySelector("#root").innerHTML = render();
    initializeHandlers(state, render);

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

    document.body.querySelector("#root").innerHTML = render();
    initializeHandlers(state, render);
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
  return Layout({
    cart: state.cart,
    children: `
      ${filterSection}
      ${productSection}
    `,
  });
}
