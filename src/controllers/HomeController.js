import { Home } from "../pages/Home.js";
import { ProductList } from "../components/product/ProductList.js";
import { CategoryFilter } from "../components/filter/CategoryFilter.js";
import { SearchFilter } from "../components/filter/SearchFilter.js";

export class HomeController {
  constructor(container) {
    this.container = container;
    this.productList = null;
    this.categoryFilter = null;
    this.searchFilter = null;
    this.isInitialized = false;
  }

  async render(params = {}) {
    const limit = parseInt(params.limit) || 20;
    const sort = params.sort || "price_asc";
    const search = params.search || "";
    const category1 = params.category1 || "";
    const category2 = params.category2 || "";

    if (!this.isInitialized) {
      const homeHTML = Home();
      this.container.innerHTML = homeHTML;

      const productListContainer = this.container.querySelector("#product-list-container");
      const categoryFilterContainer = this.container.querySelector("#category-filter-container");
      const searchFilterContainer = this.container.querySelector("#search-filter-container");

      this.productList = new ProductList(productListContainer);
      this.categoryFilter = new CategoryFilter(categoryFilterContainer);
      this.searchFilter = new SearchFilter(searchFilterContainer);

      const handleFilterChange = (filterChanges) => {
        Object.entries(filterChanges).forEach(([key, value]) => {
          if (window.router) {
            window.router.updateQuery(key, value);
          }
        });
      };

      await Promise.all([
        this.searchFilter.init(search, limit, sort, handleFilterChange),
        this.categoryFilter.init(category1, category2, handleFilterChange),
        this.productList.init({
          limit,
          sort,
          search,
          category1,
          category2,
        }),
      ]);

      this.isInitialized = true;
    } else {
      await Promise.all([
        this.searchFilter.updateValues(search, limit, sort),
        this.categoryFilter.updateValues(category1, category2),
        this.productList.updateFilters({
          limit,
          sort,
          search,
          category1,
          category2,
        }),
      ]);
    }
  }

  cleanup() {
    if (this.productList) {
      this.productList.destroy();
      this.productList = null;
    }
    if (this.categoryFilter) {
      this.categoryFilter.destroy();
      this.categoryFilter = null;
    }
    if (this.searchFilter) {
      this.searchFilter.destroy();
      this.searchFilter = null;
    }
    this.isInitialized = false;
  }

  destroy() {
    this.cleanup();
  }
}
