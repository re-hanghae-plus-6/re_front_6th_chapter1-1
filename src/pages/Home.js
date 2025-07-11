import Component from "../core/Component.js";
import { useProducts } from "../hooks/useProducts.js";
import { BreadCrumb } from "../components/filter/BreadCrumb.js";
import { Layout } from "../components/layout/Layout.js";
import { SearchInput } from "../components/filter/SearchInput.js";
import { CategoryFilter } from "../components/filter/CategoryFilter.js";
import { SortFilter } from "../components/filter/SortFilter.js";
import { ProductList } from "../components/product/ProductList.js";

export default class Home extends Component {
  setup() {
    this.productHook = useProducts();

    this.unsubscribe = this.productHook.subscribe(() => {
      this.render();
    });

    const { query } = window.router.parseCurrentUrl();
    this.productHook.loadInitialData(query);

    this.setupEvents();
  }

  template() {
    const { products, categories, isLoading, isLoadingMore, pagination } = this.productHook.getState();
    const { query } = window.router.parseCurrentUrl();

    return Layout(`
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        ${SearchInput(query.search ?? "")}
        <div class="space-y-2 mb-4">
        ${BreadCrumb(query.category1, query.category2)}
        ${CategoryFilter(categories, query.category1, query.category2)}
        ${SortFilter(query.limit ?? "20", query.sort ?? "price_asc")}
        </div>

        ${ProductList({ products, isLoading, isLoadingMore, pagination })}
      </div>
    `);
  }

  setEvent() {}

  setupEvents() {
    if (this.eventsSetup) {
      return;
    }

    this.addEvent("click", ".category1-filter-btn", (e) => {
      const category1 = e.target.dataset.category1;

      window.router.updateQuery("category1", category1, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.parseCurrentUrl();
      this.productHook.loadProducts(query);
    });

    this.addEvent("click", ".category2-filter-btn", (e) => {
      const category2 = e.target.dataset.category2;

      window.router.updateQuery("category2", category2, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.parseCurrentUrl();
      this.productHook.loadProducts(query);
    });

    this.addEvent("change", "#limit-select", (e) => {
      const limit = e.target.value;

      window.router.updateQuery("limit", limit, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.parseCurrentUrl();
      this.productHook.loadProducts(query);
    });

    this.addEvent("change", "#sort-select", (e) => {
      const sort = e.target.value;

      window.router.updateQuery("sort", sort, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.parseCurrentUrl();
      this.productHook.loadProducts(query);
    });

    this.addEvent("keypress", "#search-input", (e) => {
      if (e.key === "Enter") {
        const search = e.target.value;

        if (search) {
          window.router.updateQuery("search", search, { rerender: false });
        } else {
          window.router.updateQuery("search", null, { rerender: false });
        }
        window.router.updateQuery("page", "1", { rerender: false });

        const { query } = window.router.parseCurrentUrl();
        this.productHook.loadProducts(query);
      }
    });

    this.handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        const { query } = window.router.parseCurrentUrl();
        this.productHook.loadMoreProducts(query);
      }
    };

    window.addEventListener("scroll", this.handleScroll);

    this.eventsSetup = true;
  }

  unmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    if (this.handleScroll) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }
}
