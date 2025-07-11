import Component from "../core/Component.js";
import { useProducts } from "../hooks/useProducts.js";
import { BreadCrumb } from "../components/filter/BreadCrumb.js";
import { Layout } from "../components/layout/Layout.js";
import { SearchInput } from "../components/filter/SearchInput.js";
import { CategoryFilter } from "../components/filter/CategoryFilter.js";
import { SortFilter } from "../components/filter/SortFilter.js";
import { ProductList } from "../components/product/ProductList.js";
import { addToCart } from "../store/cart.js";
import { showToast } from "../components/common/Toast.js";

export default class Home extends Component {
  setup() {
    this.productsHook = useProducts();

    this.unsubscribe = this.productsHook.subscribe(() => {
      this.render();
    });

    const { query } = window.router.getQueryParams();
    this.productsHook.loadInitialData(query);

    this.setupEvents();
  }

  template() {
    const { products, categories, isLoading, isLoadingMore, pagination } = this.productsHook.getState();
    const { query } = window.router.getQueryParams();

    return Layout(
      `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        ${SearchInput(query.search ?? "")}
        <div class="space-y-2 mb-4">
        ${BreadCrumb(query.category1, query.category2)}
        ${CategoryFilter(categories, query.category1, query.category2)}
        ${SortFilter(query.limit ?? "20", query.sort ?? "price_asc")}
        </div>

        ${ProductList({ products, isLoading, isLoadingMore, pagination })}
      </div>
    `,
      {
        title: "쇼핑몰",
        showBackButton: false,
      },
    );
  }

  setEvent() {}

  setupEvents() {
    if (this.eventsSetup) {
      return;
    }

    this.addEvent("click", "[data-breadcrumb='reset']", () => {
      window.router.updateQuery("category1", null, { rerender: false });
      window.router.updateQuery("category2", null, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.getQueryParams();
      this.productsHook.loadProducts(query);
    });

    this.addEvent("click", "[data-breadcrumb='category1']", () => {
      window.router.updateQuery("category2", null, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.getQueryParams();
      this.productsHook.loadProducts(query);
    });

    this.addEvent("click", ".category1-filter-btn", (e) => {
      const category1 = e.target.dataset.category1;

      window.router.updateQuery("category1", category1, { rerender: false });
      window.router.updateQuery("category2", null, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.getQueryParams();
      this.productsHook.loadProducts(query);
    });

    this.addEvent("click", ".category2-filter-btn", (e) => {
      const category2 = e.target.dataset.category2;

      window.router.updateQuery("category2", category2, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.getQueryParams();
      this.productsHook.loadProducts(query);
    });

    this.addEvent("change", "#limit-select", (e) => {
      const limit = e.target.value;

      window.router.updateQuery("limit", limit, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.getQueryParams();
      this.productsHook.loadProducts(query);
    });

    this.addEvent("change", "#sort-select", (e) => {
      const sort = e.target.value;

      window.router.updateQuery("sort", sort, { rerender: false });
      window.router.updateQuery("page", "1", { rerender: false });

      const { query } = window.router.getQueryParams();
      this.productsHook.loadProducts(query);
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

        const { query } = window.router.getQueryParams();
        this.productsHook.loadProducts(query);
      }
    });

    this.addEvent("click", ".product-image", (e) => {
      const productCard = e.target.closest(".product-card");
      if (productCard) {
        const productId = productCard.dataset.productId;
        window.router.navigate(`/product/${productId}`);
      }
    });

    // 장바구니 담기 버튼 클릭
    this.addEvent("click", ".add-to-cart-btn", (e) => {
      e.stopPropagation();

      const productCard = e.target.closest(".product-card");
      if (productCard) {
        const productId = productCard.dataset.productId;
        const { products } = this.productsHook.getState();
        const product = products.find((p) => p.productId === productId);

        if (product) {
          addToCart(product, 1);
          showToast("장바구니에 추가되었습니다", "success");
        }
      }
    });

    this.handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        const { query } = window.router.getQueryParams();
        this.productsHook.loadMoreProducts(query);
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
