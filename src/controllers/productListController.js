import { store } from "../store.js";
import { actions } from "../actions.js";
import { getProducts, getCategories } from "../api/productApi.js";

export class ProductListController {
  constructor() {
    this.setupEventListeners();
  }

  get state() {
    return store.getState();
  }

  async initialize() {
    await this.loadInitialData();
  }

  async loadInitialData() {
    store.dispatch(actions.loadInitialData());

    try {
      const [categories, productsData] = await Promise.all([
        getCategories(),
        getProducts({
          page: 1,
          limit: 20,
          sort: "price_asc",
        }),
      ]);

      store.dispatch(
        actions.initialDataLoaded({
          categories,
          products: productsData.products,
          pagination: productsData.pagination,
        }),
      );
    } catch (error) {
      console.error("초기 데이터 로딩 실패:", error);
      store.dispatch(actions.loadInitialDataError(error.message));
    }
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

    document.addEventListener("keypress", (event) => {
      if (event.target.id === "search-input" && event.key === "Enter") {
        this.handleSearchChange(event);
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.dataset.category1 && !event.target.dataset.category2) {
        this.handleCategory1Change(event);
      } else if (event.target.dataset.category1 && event.target.dataset.category2) {
        this.handleCategory2Change(event);
      } else if (event.target.dataset.breadcrumb === "reset") {
        this.handleCategoryReset(event);
      } else if (event.target.dataset.breadcrumb === "category1") {
        this.handleCategory1Breadcrumb(event);
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

  handleSearchChange(event) {
    const searchValue = event.target.value.trim();
    store.dispatch(actions.searchProducts(searchValue));
    this.fetchProducts();
  }

  handleCategory1Change(event) {
    const category1 = event.target.dataset.category1;
    store.dispatch(
      actions.changeFilters({
        category1,
        category2: "", // 1depth 변경 시 2depth 클리어
      }),
    );
    this.fetchProducts();
  }

  handleCategory2Change(event) {
    const category1 = event.target.dataset.category1;
    const category2 = event.target.dataset.category2;
    store.dispatch(actions.changeFilters({ category1, category2 }));
    this.fetchProducts();
  }

  handleCategoryReset(event) {
    event.preventDefault();
    store.dispatch(
      actions.changeFilters({
        category1: "",
        category2: "",
      }),
    );
    this.fetchProducts();
  }

  handleCategory1Breadcrumb(event) {
    event.preventDefault();
    store.dispatch(
      actions.changeFilters({
        category2: "", // 2depth만 클리어
      }),
    );
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
        search: filters?.search,
        category1: filters?.category1,
        category2: filters?.category2,
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
