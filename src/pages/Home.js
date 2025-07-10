import { getProducts } from "../api/productApi.js";
import SearchFilter from "../components/list/SearchFilter.js";
import { cartStore } from "../store/store.js";

const initialState = {
  products: [],
  pagination: {},
  loading: true,
  filters: {
    page: 1,
    limit: 20,
    sort: "price_asc",
    search: "",
  },
};

class Home {
  constructor() {
    this.el = null;
    const urlParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    const initialFilters = {
      page: parseInt(urlParams.get("page")) || 1,
      limit: parseInt(urlParams.get("limit")) || 20,
      sort: urlParams.get("sort") || "price_asc",
      search: urlParams.get("search") || "",
      category1: urlParams.get("category1") || undefined,
      category2: urlParams.get("category2") || undefined,
    };

    this.state = {
      ...initialState,
      filters: { ...initialState.filters, ...initialFilters },
    };
    this.searchFilter = new SearchFilter(this.handleFilterChange.bind(this));
    this.fetchProductsDebounced = this.debounce(this.fetchProducts.bind(this), 100); // ✅ debounce 적용
  }

  handleFilterChange(newFilters) {
    const updatedFilters = { ...this.state.filters, ...newFilters, page: 1 };

    // URL 해시 업데이트
    const params = new URLSearchParams();
    for (const key in updatedFilters) {
      if (updatedFilters[key] !== undefined && updatedFilters[key] !== "" && updatedFilters[key] !== null) {
        params.set(key, updatedFilters[key]);
      }
    }
    location.hash = `?${params.toString()}`;

    // 라우터가 URL 변경을 감지하고 페이지를 재렌더링할 것이므로,
    // 여기서는 별도의 setState나 fetchProducts 호출이 필요 없습니다.
    // this.setState({ filters: updatedFilters, loading: true }); // 제거
    // this.fetchProducts(); // 제거
    // this.fetchProductsDebounced(); // 제거
  }
  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  async fetchProducts() {
    try {
      const data = await getProducts(this.state.filters);
      this.setState({ products: data.products, loading: false, pagination: data.pagination });
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
      this.setState({ loading: false });
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.el) {
      const oldEl = this.el;
      const newEl = this.render();
      if (oldEl.parentNode) {
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
      this.el = newEl;
    }
  }

  template() {
    return `
      <div class="home-page">
        <div id="search-filter-container"></div>
        <div id="product-list-container">
          ${this.templateProducts()}
        </div>
      </div>
    `;
  }

  templateProducts() {
    const totalCount = (this.state.pagination || {}).total || 0;

    if (this.state.loading) {
      return `<!-- 로딩 스켈레톤 --> <div class="grid grid-cols-2 gap-4 mb-6"> ${Array(4)
        .fill(0)
        .map(
          () =>
            `<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"><div class="aspect-square bg-gray-200"></div><div class="p-3"><div class="h-4 bg-gray-200 rounded mb-2"></div><div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div><div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div><div class="h-8 bg-gray-200 rounded"></div></div></div>`,
        )
        .join("")}</div>`;
    }

    if (!this.state.products || !this.state.products.length) {
      return `<div class="text-center py-4"><p class="text-gray-600">불러올 상품이 없습니다.</p></div>`;
    }

    return `
      <div class="mb-4 text-sm text-gray-600">총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품</div>
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${this.state.products
          .map(
            (item) => `
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" data-product-id="${item.productId}">
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy">
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${item.title}</h3>
              <p class="text-lg font-bold text-gray-900">${parseInt(item.lprice).toLocaleString()}원</p>
              <button class="w-full mt-2 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${item.productId}">장바구니 담기</button>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  render() {
    let newEl = this.el;
    if (!newEl) {
      newEl = document.createElement("main");
      newEl.className = "max-w-md mx-auto px-4 py-4";
    }
    newEl.innerHTML = this.template();

    const searchFilterContainer = newEl.querySelector("#search-filter-container");
    // this.state.filters를 SearchFilter의 render 메서드에 전달
    const searchFilterEl = this.searchFilter.render(this.state.filters);
    searchFilterContainer.appendChild(searchFilterEl);

    this.el = newEl;
    this.addEventListeners();
    return this.el;
  }

  addEventListeners() {
    this.el.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.productId;
        const product = this.state.products.find((p) => p.productId === productId);
        if (product) {
          cartStore.addItem(product);
        }
      });
    });
  }

  init() {
    // URL에서 필터 값을 읽어와서 초기 상태를 설정합니다.
    const urlParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    const initialFilters = {
      page: parseInt(urlParams.get("page")) || 1,
      limit: parseInt(urlParams.get("limit")) || 20,
      sort: urlParams.get("sort") || "price_asc",
      search: urlParams.get("search") || "",
      category1: urlParams.get("category1") || undefined,
      category2: urlParams.get("category2") || undefined,
    };
    this.setState({ filters: initialFilters }); // 초기 필터 상태 설정

    this.fetchProducts();
    this.searchFilter.fetchCategories();
    // SearchFilter의 상태를 초기화합니다.
    // selectedCategories는 배열이므로, category1이 있을 때만 추가하고, category2는 category1이 있을 때만 추가합니다.
    const selectedCategoriesForSearchFilter = [];
    if (initialFilters.category1) {
      selectedCategoriesForSearchFilter.push(initialFilters.category1);
      if (initialFilters.category2) {
        selectedCategoriesForSearchFilter.push(initialFilters.category2);
      }
    }

    this.searchFilter.setState({
      selectedCategories: selectedCategoriesForSearchFilter,
      searchQuery: initialFilters.search || "",
    });
    return this.el;
  }
}

export default Home;
