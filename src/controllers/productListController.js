import { store } from "../store.js";
import { actions } from "../actions.js";
import { getProducts } from "../api/productApi.js";

export class ProductListController {
  constructor() {
    this.setupEventListeners();
  }

  get state() {
    return store.getState();
  }

  setupEventListeners() {
    document.addEventListener("change", (event) => {
      if (event.target.id === "limit-select") {
        this.handleLimitChange(event);
      }
      if (event.target.id === "sort-select") {
        this.handleSortChange(event);
      }
    });
  }

  handleLimitChange(event) {
    const newSelectLimit = parseInt(event.target.value);

    if (this.state.products.length >= newSelectLimit) {
      store.dispatch(actions.sliceList(newSelectLimit));
    }

    store.dispatch(actions.changeLimit(newSelectLimit));
    this.fetchProducts();
  }

  handleSortChange(event) {
    const newSelectSort = event.target.value;
    store.dispatch(actions.changeSorts(newSelectSort));
    this.fetchProducts();
  }

  async fetchProducts() {
    store.dispatch(actions.loadProducts());

    try {
      const { pagination, filters } = this.state;

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters?.sort,
      };

      const data = await getProducts(params);

      store.dispatch(actions.productsLoaded(data));
    } catch (error) {
      console.error(error);
      store.dispatch(actions.loadError(error.message));
    }
  }
}
