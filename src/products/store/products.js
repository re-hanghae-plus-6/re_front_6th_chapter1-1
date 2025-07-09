import { getCategories, getProducts } from "../../api/productApi";
import { observable } from "../../core/observer";
import { router } from "../../core/router";

const LOAD_DEFAULT_PAGE = 1;
const defaultParams = {
  limit: 20,
  search: "",
  category1: "",
  category2: "",
  sort: "price_asc",
};

export const productsStore = observable({
  ...defaultParams,

  isLoading: true,
  isFetching: false,
  products: [],
  currentPageProducts: [],
  categories: null,
  page: null,
  total: null,
  hasNext: null,

  getParams() {
    return {
      limit: productsStore.limit,
      search: productsStore.search,
      category1: productsStore.category1,
      category2: productsStore.category2,
      sort: productsStore.sort,
      page: productsStore.page,
    };
  },
  initSearchParams() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", LOAD_DEFAULT_PAGE);
    for (const [key, value] of Object.entries(defaultParams)) {
      productsStore[key] = searchParams.get(key) || value;
    }
  },
  updateParams(key, value) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    router.updateParams(Object.fromEntries(searchParams));
  },
  setLimit(limit) {
    productsStore.limit = limit;
    productsStore.updateParams("limit", limit);
    productsStore.load();
  },
  setSearch(search) {
    productsStore.search = search;
    productsStore.updateParams("search", search);
    productsStore.load();
  },
  setCategory1(category1) {
    productsStore.category1 = category1;
    productsStore.updateParams("category1", category1);
    productsStore.load();
  },
  setCategory2(category2) {
    productsStore.category2 = category2;
    productsStore.updateParams("category2", category2);
    productsStore.load();
  },
  setSort(sort) {
    productsStore.sort = sort;
    productsStore.updateParams("sort", sort);
    productsStore.load();
  },
  async load() {
    productsStore.page = LOAD_DEFAULT_PAGE;
    const data = await productsStore.fetchProducts(productsStore.params);
    productsStore.products = data.products;
    productsStore.isLoading = false;
  },
  async loadNextPage() {
    productsStore.page = productsStore.page + 1;
    const data = await productsStore.fetchProducts();
    productsStore.products = [...productsStore.products, ...data.products];
  },
  async fetchProducts() {
    productsStore.isFetching = true;
    const data = await getProducts(productsStore.getParams());

    productsStore.currentPageProducts = data.products;
    productsStore.page = data.pagination.page;
    productsStore.hasNext = data.pagination.hasNext;
    productsStore.total = data.pagination.total;
    productsStore.isFetching = false;

    return data;
  },
  async loadCategories() {
    productsStore.categories = await getCategories();
  },
});
