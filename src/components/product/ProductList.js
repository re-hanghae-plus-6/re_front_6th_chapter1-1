import { ProductCard } from "./ProductCard.js";
import { ProductSkeletonCard } from "./ProductSkeletonCard.js";
import { ProductsModel } from "../../models/ProductsModel.js";

export class ProductList {
  constructor(container) {
    this.container = container;
    this.productsModel = new ProductsModel();
    this.unsubscribe = null;
    this.isLoadingMore = false;
  }

  async init(filters = {}) {
    this.render({
      products: [],
      loading: true,
      totalCount: 0,
      hasMore: false,
    });

    this.unsubscribe = this.productsModel.subscribe((state) => {
      this.render(state);
    });

    this.setupScrollListener();
    this.setupEventListeners();

    this.productsModel.state.filters = { ...this.productsModel.state.filters, ...filters };
    await this.productsModel.initialize();
  }

  setupScrollListener() {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        this.loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    this.removeScrollListener = () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }

  setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      if (e.target.closest(".product-image")) {
        const productCard = e.target.closest(".product-card");
        const productId = productCard.dataset.productId;

        if (productId && window.router) {
          window.router.navigate(`/product/${productId}`);
        }
      }
    });
  }

  async loadMore() {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;
    await this.productsModel.loadMore();
    this.isLoadingMore = false;
  }

  render(state) {
    const { products, loading, totalCount, hasMore } = state;

    this.container.innerHTML = `
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          ${
            loading && products.length === 0
              ? ""
              : `
          <div class="mb-4 text-sm text-gray-600">
            총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품
          </div>
          `
          }
          
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            ${products.map((product) => ProductCard(product)).join("")}
            ${
              loading && products.length === 0
                ? Array(4)
                    .fill()
                    .map(() => ProductSkeletonCard())
                    .join("")
                : ""
            }
          </div>
          
          <!-- 하단 메시지 -->
          ${
            loading && products.length > 0
              ? `
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>
          `
              : !hasMore && products.length > 0
                ? `
              <div class="text-center py-4 text-sm text-gray-500">
                모든 상품을 확인했습니다
              </div>
            `
                : ""
          }
        </div>
      </div>
    `;
  }

  async updateFilters(filters) {
    await this.productsModel.updateFilters(filters);
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.removeScrollListener) {
      this.removeScrollListener();
    }
  }
}
