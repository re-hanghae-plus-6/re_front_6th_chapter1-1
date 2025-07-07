import HomePage from "../pages/HomePage.js";
import productService from "../services/ProductService.js";
import router from "../router/Router.js";
import InfiniteScrollManager from "../services/InfiniteScrollManager.js";
import { addToCart, updateCartBadge, openCartModal, loadCart } from "../features/cart/index.js";

class HomePageController {
  constructor(rootSelector = "#root") {
    this.rootEl = document.querySelector(rootSelector);
    this.state = {
      products: [],
      total: 0,
      loading: false,
      loadingMore: false,
      categories: {},
      limit: 20,
      page: 1,
      search: "",
      category1: "",
      category2: "",
      sort: "price_asc",
    };
    this.scrollManager = null;
  }

  async init() {
    loadCart();
    await Promise.all([this.fetchProducts(), productService.getCategories().then((c) => (this.state.categories = c))]);
    this.render();
    this.setupInfiniteScroll();
  }

  async fetchProducts() {
    const { products, pagination } = await productService.getProducts({
      limit: this.state.limit,
      page: this.state.page,
      search: this.state.search,
      category1: this.state.category1,
      category2: this.state.category2,
      sort: this.state.sort,
    });
    this.state.products = products;
    this.state.total = pagination.total;
  }

  async loadMore() {
    this.state.loadingMore = true;
    this.render();
    const nextPage = this.state.page + 1;
    const { products: newProducts, pagination } = await productService.getProducts({
      limit: this.state.limit,
      page: nextPage,
      search: this.state.search,
      category1: this.state.category1,
      category2: this.state.category2,
      sort: this.state.sort,
    });
    this.state.products = [...this.state.products, ...newProducts];
    this.state.total = pagination.total;
    this.state.page = nextPage;
    this.state.loadingMore = false;
    this.render();
  }

  setupInfiniteScroll() {
    if (this.scrollManager) return;
    this.scrollManager = new InfiniteScrollManager(async () => {
      if (!this.state.loading && !this.state.loadingMore && this.state.products.length < this.state.total) {
        await this.loadMore();
      }
    });
    this.scrollManager.attach();
  }

  render() {
    this.rootEl.innerHTML = HomePage(this.state);
    this.attachEventListeners();
    updateCartBadge();
  }

  attachEventListeners() {
    const { state } = this;
    const limitSelect = document.querySelector("#limit-select");
    if (limitSelect) {
      limitSelect.value = String(state.limit);
      limitSelect.onchange = async (e) => {
        state.limit = Number(e.target.value);
        state.page = 1;
        await this.fetchProducts();
        this.render();
      };
    }

    const searchInput = document.querySelector("#search-input");
    if (searchInput) {
      searchInput.value = state.search;
      searchInput.onkeydown = async (e) => {
        if (e.key === "Enter") {
          const keyword = searchInput.value.trim();
          if (state.search !== keyword) {
            state.search = keyword;
            state.page = 1;
            await this.fetchProducts();
            this.render();
          }
        }
      };
    }

    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.onclick = () => {
        const product = state.products.find((p) => String(p.productId) === btn.dataset.productId);
        if (product) addToCart(product);
      };
    });

    document.querySelector("#cart-icon-btn")?.addEventListener("click", openCartModal);

    // 카테고리 필터
    document.querySelectorAll(".category1-filter-btn").forEach((btn) => {
      btn.onclick = async () => {
        state.category1 = btn.dataset.category1;
        state.category2 = "";
        state.page = 1;
        await this.fetchProducts();
        this.render();
      };
    });

    document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
      btn.onclick = async () => {
        state.category1 = btn.dataset.category1;
        state.category2 = btn.dataset.category2;
        state.page = 1;
        await this.fetchProducts();
        this.render();
      };
    });

    document.querySelector('[data-breadcrumb="reset"]')?.addEventListener("click", async () => {
      state.category1 = "";
      state.category2 = "";
      state.page = 1;
      await this.fetchProducts();
      this.render();
    });

    document.querySelector('[data-breadcrumb="category1"]')?.addEventListener("click", async (e) => {
      state.category1 = e.target.dataset.category1;
      state.category2 = "";
      state.page = 1;
      await this.fetchProducts();
      this.render();
    });

    // 상품 카드 클릭 → 상세 페이지 이동
    document.querySelectorAll(".product-image, .product-info").forEach((el) => {
      el.onclick = () => {
        const card = el.closest(".product-card");
        const pid = card.dataset.productId;
        router.navigate(`/product/${pid}`);
      };
    });

    // 정렬 드롭다운
    const sortSelect = document.querySelector("#sort-select");
    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.onchange = async (e) => {
        state.sort = e.target.value;
        state.page = 1;
        await this.fetchProducts();
        this.render();
      };
    }
  }
}

// 싱글톤 인스턴스로 export
const homePageController = new HomePageController();
export default homePageController;
