import { getCategories, getProducts } from "../api/productApi";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { Component } from "../core/Component";

export class ProductListPage extends Component {
  constructor(router) {
    super("#root");

    const params = new URLSearchParams(window.location.search);

    this.router = router;
    this.state = {
      loading: false,
      products: [],
      pagination: {
        limit: parseInt(params.get("limit")) || 20,
      },
      filters: {},
      categories: {},
    };

    this.#attachEventListeners();
    this.#loadProductsAndCategories();
  }

  render() {
    this.element.innerHTML =
      /* HTML */
      `<div class="min-h-screen bg-gray-50">
        ${Header()}
        <main class="max-w-md mx-auto px-4 py-4">
          <!-- 검색 및 필터 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <!-- 검색창 -->
            <div class="mb-4">
              <div class="relative">
                <input
                  type="text"
                  id="search-input"
                  placeholder="상품명을 검색해보세요..."
                  value=""
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 필터 옵션 -->
            <div class="space-y-3">
              <!-- 카테고리 필터 -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">카테고리:</label>
                  <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                </div>
                <!-- 1depth 카테고리 -->
                <div class="flex flex-wrap gap-2">
                  <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
                </div>
                <!-- 2depth 카테고리 -->
              </div>
              <!-- 기존 필터들 -->
              <div class="flex gap-2 items-center justify-between">
                <!-- 페이지당 상품 수 -->
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">개수:</label>
                  <select
                    id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="10" ${this.state.pagination.limit === 10 ? "selected" : ""}>10개</option>
                    <option value="20" ${this.state.pagination.limit === 20 ? "selected" : ""}>20개</option>
                    <option value="50" ${this.state.pagination.limit === 50 ? "selected" : ""}>50개</option>
                    <option value="100" ${this.state.pagination.limit === 100 ? "selected" : ""}>100개</option>
                  </select>
                </div>
                <!-- 정렬 -->
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">정렬:</label>
                  <select
                    id="sort-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="price_asc" selected="">가격 낮은순</option>
                    <option value="price_desc">가격 높은순</option>
                    <option value="name_asc">이름순</option>
                    <option value="name_desc">이름 역순</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 상품 목록 -->
          <div class="mb-6">
            <div>
              <!-- 상품 개수 정보 -->
              ${this.state.loading
                ? ""
                : /* HTML */ `<div class="mb-4 text-sm text-gray-600">
                    총 <span class="font-medium text-gray-900">${this.state.pagination.total}개</span>의 상품
                  </div> `}
              <!-- 상품 그리드 -->
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${this.state.loading
                  ? new Array(4).fill(0).map(ProductSkeleton).join("")
                  : this.state.products.map(ProductCard).join("")}
              </div>

              <div class="text-center py-4">
                <div class="inline-flex items-center">
                  <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        ${Footer()}
      </div>`;
  }

  async #loadProductsAndCategories() {
    this.setState({ loading: true });

    try {
      const [products, categories] = await Promise.all([
        getProducts({
          page: 1,
          limit: this.state.pagination.limit ?? 20,
          search: this.state.filters.search ?? "",
          category1: this.state.filters.category1 ?? "",
          category2: this.state.filters.category2 ?? "",
          sort: this.state.filters.sort ?? "price_asc",
        }),
        getCategories(),
      ]);

      this.setState({
        ...products,
        categories,
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("상품 및 카테고리 리스트 로딩 실패:", error.message);
        this.setState({ loading: false });
      }
    }
  }

  async #reloadProducts(params) {
    try {
      const products = await getProducts(params);
      this.setState({ ...products, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("상품 및 카테고리 리스트 로딩 실패:", error.message);
        this.setState({ loading: false });
      }
    }
  }

  #updateURLParams(newParams) {
    const url = new URL(window.location);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "") {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.replaceState(null, "", url.toString());
  }

  async #handleLimitChange(limit) {
    this.#updateURLParams({ limit });
    await this.#reloadProducts({ limit });
  }

  #attachEventListeners() {
    this.element.addEventListener("click", (e) => {
      const route = e.target.dataset.route;
      if (route) {
        this.router.navigate(route);
      }
    });

    this.element.addEventListener("change", (e) => {
      if (e.target.id === "limit-select") {
        this.#handleLimitChange(e.target.value);
      }
    });
  }
}
