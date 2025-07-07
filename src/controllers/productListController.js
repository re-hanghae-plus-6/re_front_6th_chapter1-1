import { store } from "../store.js";
import { actions } from "../actions.js";
import { getProducts } from "../api/productApi.js";

export class ProductListController {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("change", (event) => {
      if (event.target.id === "limit-select") {
        this.handleLimitChange(event);
      }
    });
  }

  handleLimitChange(event) {
    const newSelectLimit = parseInt(event.target.value);
    const state = store.getState();

    if (state.products.length >= newSelectLimit) {
      store.dispatch(actions.sliceList(newSelectLimit));
    }

    store.dispatch(actions.changeFilters({ limit: newSelectLimit }));
    this.fetchProducts();
  }

  async fetchProducts() {
    store.dispatch(actions.loadProducts());

    try {
      const state = store.getState();
      const { pagination } = state;

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      const data = await getProducts(params);

      store.dispatch(actions.productsLoaded(data));
    } catch (error) {
      console.error(error);
      store.dispatch(actions.loadError(error.message));
    }
  }
}
