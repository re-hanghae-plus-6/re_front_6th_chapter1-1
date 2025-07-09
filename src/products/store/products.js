import { getProducts } from "../../api/productApi";
import { observable } from "../../core/observer";

const DEFAULT_PAGE = 1;

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
    };
  },
  initSearchParams: () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", DEFAULT_PAGE);
    for (const [key, value] of searchParams) {
      productsStore[key] = value;
    }
  },
  setLimit(limit) {
    productsStore.limit = limit;
    productsStore.page = DEFAULT_PAGE;
  },
  setSearch(search) {
    productsStore.search = search;
    productsStore.page = DEFAULT_PAGE;
  },
  setCategory1(category1) {
    productsStore.category1 = category1;
    productsStore.page = DEFAULT_PAGE;
  },
  setCategory2(category2) {
    productsStore.category2 = category2;
    productsStore.page = DEFAULT_PAGE;
  },
  setSort(sort) {
    productsStore.sort = sort;
    productsStore.page = DEFAULT_PAGE;
  },
  async load() {
    await productsStore.fetchProducts(productsStore.params);
    productsStore.isLoading = false;
  },
  async loadNextPage() {
    productsStore.updateParams({ page: productsStore.page + 1 });
    await productsStore.fetchProducts();
  },
  async fetchProducts() {
    productsStore.isFetching = true;
    const data = await getProducts(productsStore.params);

    productsStore.products = [...productsStore.products, ...data.products];
    productsStore.currentPageProducts = data.products;
    productsStore.page = data.pagination.page;
    productsStore.hasNext = data.pagination.hasNext;
    productsStore.total = data.pagination.total;
    productsStore.isFetching = false;

    return data;
  },
});
