import { getProducts } from "../../api/productApi";
import { observable } from "../../core/observer";

const LOAD_DEFAULT_PAGE = 1;

export const productsStore = observable({
  limit: 20,
  search: "",
  category1: "",
  category2: "",
  sort: "price_asc",

  isLoading: true,
  isFetching: false,
  products: [],
  currentPageProducts: [],
  page: null,
  total: null,
  hasNext: null,

  getParams: () => {
    return {
      limit: productsStore.limit,
      search: productsStore.search,
      category1: productsStore.category1,
      category2: productsStore.category2,
      sort: productsStore.sort,
      page: productsStore.page,
    };
  },
  initSearchParams: () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", LOAD_DEFAULT_PAGE);
    for (const [key, value] of searchParams) {
      productsStore[key] = value;
    }
  },
  setLimit(limit) {
    productsStore.limit = limit;
    productsStore.load();
  },
  setSearch(search) {
    productsStore.search = search;
    productsStore.load();
  },
  setCategory1(category1) {
    productsStore.category1 = category1;
    productsStore.load();
  },
  setCategory2(category2) {
    productsStore.category2 = category2;
    productsStore.load();
  },
  setSort(sort) {
    productsStore.sort = sort;
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
});
