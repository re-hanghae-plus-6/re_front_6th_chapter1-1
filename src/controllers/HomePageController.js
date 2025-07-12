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

    // URL 쿼리 → 초기 상태 반영
    this.applyQueryParams();
  }

  // 현재 URL 의 쿼리스트링을 읽어 state 에 반영
  applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("sort")) this.state.sort = params.get("sort");
    if (params.has("limit")) this.state.limit = Number(params.get("limit"));
    if (params.has("search")) this.state.search = params.get("search");
    if (params.has("category1")) this.state.category1 = params.get("category1");
    if (params.has("category2")) this.state.category2 = params.get("category2");
  }

  // state 값을 쿼리스트링으로 직렬화하여 pushState (페이지 새로고침 시 유지)
  updateQueryParams({ replace = false } = {}) {
    const params = new URLSearchParams();
    if (this.state.sort && this.state.sort !== "price_asc") params.set("sort", this.state.sort);
    if (!(replace && this.state.limit === 20)) {
      params.set("limit", String(this.state.limit));
    }
    if (this.state.search) params.set("search", this.state.search);
    if (this.state.category1) params.set("category1", this.state.category1);
    if (this.state.category2) params.set("category2", this.state.category2);

    const qs = params.toString();
    const newUrl = qs ? `${router.BASE_PATH}/?${qs}` : router.BASE_PATH;
    let method = replace ? "replaceState" : "pushState";
    // limit 가 기본값(20)으로 돌아가는 경우 히스토리 덮어쓰기
    if (!replace && this.state.limit === 20 && params.size === 1 && params.has("limit")) {
      method = "replaceState";
    }
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history[method]({}, "", newUrl);
    }
  }

  async init() {
    // 테스트 등 여러 번 init 될 때 이전 상태가 남아있지 않도록 기본 상태로 초기화
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

    // URL 쿼리 적용 (초기화 이후 다시 적용)
    this.applyQueryParams();

    loadCart();
    // 1) 초깃값 로딩 상태 활성화 → 로딩 UI(스켈레톤, "카테고리 로딩 중...") 표시
    this.state.loading = true;
    this.render();

    // 2) 상품·카테고리 동시 요청
    const [, categories] = await Promise.all([this.fetchProducts(), productService.getCategories().then((c) => c)]);

    // 3) 응답 데이터 상태 반영
    this.state.categories = categories;
    this.state.loading = false;

    // 4) 최종 렌더링 및 스크롤 설정
    this.render();
    this.setupInfiniteScroll();
    // 렌더링 후 현재 상태를 URL에 반영
    this.updateQueryParams({ replace: true });
  }

  async fetchProducts() {
    // (테스트 디버그용 로그 제거)
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
        this.updateQueryParams();
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
            this.updateQueryParams();
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
        this.updateQueryParams();
        await this.fetchProducts();
        this.render();
      };
    });

    document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
      btn.onclick = async () => {
        state.category1 = btn.dataset.category1;
        state.category2 = btn.dataset.category2;
        state.page = 1;
        this.updateQueryParams();
        await this.fetchProducts();
        this.render();
      };
    });

    document.querySelector('[data-breadcrumb="reset"]')?.addEventListener("click", async () => {
      state.category1 = "";
      state.category2 = "";
      state.page = 1;
      this.updateQueryParams();
      await this.fetchProducts();
      this.render();
    });

    document.querySelector('[data-breadcrumb="category1"]')?.addEventListener("click", async (e) => {
      state.category1 = e.target.dataset.category1;
      state.category2 = "";
      state.page = 1;
      this.updateQueryParams();
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
        this.updateQueryParams();
        await this.fetchProducts();
        this.render();
      };
    }
  }
}

// 싱글톤 인스턴스로 export
const homePageController = new HomePageController();
export default homePageController;
