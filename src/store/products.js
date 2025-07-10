import { getCategories, getProducts } from "../api/productApi";
import { observable } from "../core/observer";
import { router } from "../core/router";

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
    const params = { ...defaultParams, ...router.getParams() };
    params.page = LOAD_DEFAULT_PAGE;
    for (const [key, value] of Object.entries(params)) {
      productsStore[key] = value;
    }
  },
  updateParams(key, value) {
    const params = router.getParams();
    params[key] = value;
    router.updateParams(params);
  },
  setLimit(limit) {
    productsStore.limit = limit;
    productsStore.updateParams("limit", limit);
    productsStore.loadProducts();
  },
  setSearch(search) {
    productsStore.search = search;
    productsStore.updateParams("search", search);
    productsStore.loadProducts();
  },
  setCategory1(category1) {
    productsStore.category1 = category1;
    productsStore.updateParams("category1", category1);
    productsStore.loadProducts();
  },
  setCategory2(category2) {
    productsStore.category2 = category2;
    productsStore.updateParams("category2", category2);
    productsStore.loadProducts();
  },
  setSort(sort) {
    productsStore.sort = sort;
    productsStore.updateParams("sort", sort);
    productsStore.loadProducts();
  },
  async loadProducts() {
    productsStore.page = LOAD_DEFAULT_PAGE;
    const data = await productsStore.fetchProducts();
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

const defaultParams2 = {
  ...defaultParams,
  page: 1,
};

export const productsStore2 = observable({
  params: defaultParams2,
  data: {
    isLoading: true,
    isFetching: false,
    products: [],
    currentPageProducts: [],
    categories: null,
    page: null,
    total: null,
    hasNext: null,
  },

  getParams() {
    return defaultParams2.params;
  },
  initSearchParams() {
    const params = { ...defaultParams2, ...router.getParams(), page: LOAD_DEFAULT_PAGE };
    productsStore2.params = params;
  },
  updateParams(key, value) {
    const params = router.getParams();
    params[key] = value;
    router.updateParams(params);
  },
  setLimit(limit) {
    productsStore2.params.limit = limit;
    productsStore2.updateParams("limit", limit);
    productsStore2.loadProducts();
  },
  setSearch(search) {
    productsStore2.params.search = search;
    productsStore2.updateParams("search", search);
    productsStore2.loadProducts();
  },
  setCategory1(category1) {
    productsStore2.params.category1 = category1;
    productsStore2.updateParams("category1", category1);
    productsStore2.loadProducts();
  },
  setCategory2(category2) {
    productsStore2.params.category2 = category2;
    productsStore2.updateParams("category2", category2);
    productsStore2.loadProducts();
  },
  setSort(sort) {
    productsStore2.params.sort = sort;
    productsStore2.updateParams("sort", sort);
    productsStore2.loadProducts();
  },
  async loadProducts() {
    productsStore2.page = LOAD_DEFAULT_PAGE;
    const data = await productsStore2.fetchProducts();
    productsStore2.data = {
      isLoading: false,
      products: data.products,
      currentPageProducts: data.products,
      page: data.pagination.page,
      hasNext: data.pagination.hasNext,
      total: data.pagination.total,
    };
  },
  async loadNextPage() {
    productsStore2.page = productsStore2.page + 1;
    const data = await productsStore2.fetchProducts();
    productsStore2.data = {
      isFetching: false,
      products: [...productsStore2.data.products, ...data.products],
      currentPageProducts: data.products,
      page: data.pagination.page,
      hasNext: data.pagination.hasNext,
      total: data.pagination.total,
    };
  },
  async fetchProducts() {
    productsStore2.data.isFetching = true;
    const data = await getProducts(productsStore2.getParams());

    return data;
  },
  async loadCategories() {
    productsStore2.categories = await getCategories();
  },
});
