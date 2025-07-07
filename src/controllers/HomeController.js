import { Home } from "../pages/Home.js";
import { getProducts, getCategories } from "../api/productApi.js";

export class HomeController {
  constructor(container) {
    this.container = container;
  }

  async render(params = {}) {
    const limit = parseInt(params.limit) || 20;
    const sort = params.sort || "price_asc";
    const search = params.search || "";
    const category1 = params.category1 || "";
    const category2 = params.category2 || "";

    const loadingHTML = Home({
      isLoading: true,
    });
    this.container.innerHTML = loadingHTML;

    const [productsResponse, categoriesResponse] = await Promise.all([
      getProducts({
        limit,
        sort,
        search,
        category1,
        category2,
      }),
      getCategories(),
    ]);

    const products = productsResponse.products || [];
    const categories = categoriesResponse || [];
    const pagination = productsResponse.pagination || {};
    const filters = productsResponse.filters || {};

    const homeHTML = Home({
      products,
      categories,
      totalCount: pagination.total || 0,
      isLoading: false,
      hasMore: pagination.hasNext || false,
      selectedCategory1: filters.category1 || category1,
      selectedCategory2: filters.category2 || category2,
      searchQuery: filters.search || search,
      limit: pagination.limit || limit,
      sort: filters.sort || sort,
    });

    this.container.innerHTML = homeHTML;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const limitSelect = this.container.querySelector("#limit-select");
    if (limitSelect) {
      limitSelect.addEventListener("change", (e) => {
        const selectedLimit = e.target.value;

        if (window.router) {
          window.router.updateQuery("limit", selectedLimit);
        }
      });
    }

    const sortSelect = this.container.querySelector("#sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        const selectedSort = e.target.value;

        if (window.router) {
          window.router.updateQuery("sort", selectedSort);
        }
      });
    }

    const searchInput = this.container.querySelector("#search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const searchValue = e.target.value.trim();

          if (window.router) {
            window.router.updateQuery("search", searchValue);
          }
        }
      });
    }
  }
}
