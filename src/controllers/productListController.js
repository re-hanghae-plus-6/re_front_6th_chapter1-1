import { store } from "../store.js";
import { actions } from "../actions/index.js";
import { getProducts, getCategories } from "../api/productApi.js";
import { getQueryParams, updateQueryParams } from "../utils/urlUtils.js";

export class ProductListController {
  #eventListeners = [];

  constructor() {
    this.storeSubscription = null;
  }

  get state() {
    return store.getState();
  }

  setupEventListeners() {
    this.#eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.#eventListeners = [];

    this.#setupEventListeners();
  }

  async loadData() {
    try {
      const queryParams = getQueryParams();

      store.dispatch(
        actions.changeFilters({
          sort: queryParams.sort,
          search: queryParams.search,
          category1: queryParams.category1,
          category2: queryParams.category2,
        }),
      );
      store.dispatch(actions.changeLimit(parseInt(queryParams.limit)));

      const [categories, productsData] = await Promise.all([
        getCategories(),
        getProducts({
          page: 1,
          limit: parseInt(queryParams.limit),
          sort: queryParams.sort,
          search: queryParams.search,
          category1: queryParams.category1,
          category2: queryParams.category2,
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

  async loadInitialData() {
    store.dispatch(actions.loadInitialData());
    await this.loadData();
  }

  #setupEventListeners() {
    const changeHandler = (event) => {
      if (event.target.id === "limit-select") {
        this.#handleLimitChange(event);
      }
      if (event.target.id === "sort-select") {
        this.#handleSortChange(event);
      }
    };

    const keypressHandler = (event) => {
      if (event.target.id === "search-input" && event.key === "Enter") {
        this.#handleSearchChange(event);
      }
    };

    const keydownHandler = (event) => {
      if (event.key === "Escape") {
        const isModalOpen = this.state.cart.isModalOpen;
        if (isModalOpen) {
          store.dispatch(actions.hideCartModal());
        }
      }
    };

    const clickHandler = (event) => {
      if (event.target.closest(".add-to-cart-btn")) {
        event.stopPropagation();
        const productCard = event.target.closest(".product-card");
        this.#handleAddToCart(productCard);
        return;
      }

      const productCard = event.target.closest(".product-card");
      if (productCard) {
        this.#handleProductCardClick(productCard);
        return;
      }

      if (event.target.closest(".cart-modal")) {
        return;
      }

      if (event.target.dataset.category1 && !event.target.dataset.category2) {
        this.#handleCategory1Change(event);
      } else if (event.target.dataset.category1 && event.target.dataset.category2) {
        this.#handleCategory2Change(event);
      } else if (event.target.dataset.breadcrumb === "reset") {
        this.#handleCategoryReset(event);
      } else if (event.target.dataset.breadcrumb === "category1") {
        this.#handleCategory1Breadcrumb(event);
      }
    };

    const scrollHandler = () => {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
        this.#loadNextPage();
      }
    };

    document.addEventListener("change", changeHandler);
    document.addEventListener("keypress", keypressHandler);
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("click", clickHandler);
    window.addEventListener("scroll", scrollHandler);

    this.#eventListeners.push(
      { element: document, type: "change", handler: changeHandler },
      { element: document, type: "keypress", handler: keypressHandler },
      { element: document, type: "keydown", handler: keydownHandler },
      { element: document, type: "click", handler: clickHandler },
      { element: window, type: "scroll", handler: scrollHandler },
    );
  }

  #handleLimitChange(event) {
    const newSelectLimit = parseInt(event.target.value);

    if (this.state.products.length >= newSelectLimit) {
      store.dispatch(actions.sliceList(newSelectLimit));
    }

    store.dispatch(actions.changeLimit(newSelectLimit));
    updateQueryParams({ limit: newSelectLimit });
    this.fetchProducts(1, true);
  }

  #handleSortChange(event) {
    const newSelectSort = event.target.value;
    store.dispatch(actions.changeSorts(newSelectSort));
    updateQueryParams({ sort: newSelectSort });
    this.fetchProducts(1, true);
  }

  #handleSearchChange(event) {
    const searchValue = event.target.value.trim();
    store.dispatch(actions.searchProducts(searchValue));
    updateQueryParams({ search: searchValue });
    this.fetchProducts(1, true);
  }

  #handleCategory1Change(event) {
    const category1 = event.target.dataset.category1;
    store.dispatch(
      actions.changeFilters({
        category1,
        category2: "",
      }),
    );
    updateQueryParams({ category1, category2: "" });
    this.fetchProducts(1, true);
  }

  #handleCategory2Change(event) {
    const category1 = event.target.dataset.category1;
    const category2 = event.target.dataset.category2;
    store.dispatch(actions.changeFilters({ category1, category2 }));
    updateQueryParams({ category1, category2 });
    this.fetchProducts(1, true);
  }

  #handleCategoryReset(event) {
    event.preventDefault();
    store.dispatch(
      actions.changeFilters({
        category1: "",
        category2: "",
      }),
    );
    updateQueryParams({ category1: "", category2: "" });
    this.fetchProducts(1, true);
  }

  #handleCategory1Breadcrumb(event) {
    event.preventDefault();
    store.dispatch(
      actions.changeFilters({
        category2: "",
      }),
    );
    updateQueryParams({ category2: "" });
    this.fetchProducts(1, true);
  }

  async fetchProducts(page = 1, skipLoadingAction = false) {
    if (!skipLoadingAction) {
      store.dispatch(actions.loadProducts());
    }

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

  async #loadNextPage() {
    const { pagination } = this.state;
    const nextPage = pagination.page + 1;

    if (nextPage > Math.ceil(pagination.total / pagination.limit)) {
      return;
    }

    await this.fetchProducts(nextPage);
  }

  #handleProductCardClick(productCard) {
    const productId = productCard.dataset.productId;
    if (!productId) return;

    store.dispatch(actions.navigate(`/product/${productId}`));
  }

  #handleAddToCart(productCard) {
    const productId = productCard.dataset.productId;
    if (!productId) return;
    store.dispatch(actions.addToCart(productId, 1));
    store.dispatch(actions.showToast("장바구니에 추가되었습니다"));
  }

  cleanup() {
    if (this.storeSubscription) {
      this.storeSubscription();
      this.storeSubscription = null;
    }

    this.#eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.#eventListeners = [];
  }
}
