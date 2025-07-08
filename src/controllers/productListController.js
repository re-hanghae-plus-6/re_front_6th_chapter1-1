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

    window.addEventListener("scroll", () => {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
        this.loadNextPage();
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

  async fetchProducts(page = 1) {
    store.dispatch(actions.loadProducts());

    try {
      const { pagination, filters } = this.state;

      const params = {
        page,
        limit: pagination.limit,
        sort: filters?.sort,
      };

      const data = await getProducts(params);

      store.dispatch(
        actions.productsLoaded({
          products: data.products,
          pagination: data.pagination,
        }),
      );
    } catch (error) {
      console.error(error);
      store.dispatch(actions.loadError(error.message));
    }
  }

  async loadNextPage() {
    const { pagination } = this.state;
    const nextPage = pagination.page + 1;

    if (nextPage > Math.ceil(pagination.total / pagination.limit)) {
      return;
    }

    await this.fetchProducts(nextPage);
  }
}
