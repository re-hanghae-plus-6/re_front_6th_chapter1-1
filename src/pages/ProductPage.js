import { getProduct } from "../api/productApi";
import { BackArrowIcon } from "../components/icons/BackArrowIcon";
import { MinusIcon } from "../components/icons/MinusIcon";
import { PlusIcon } from "../components/icons/PlusIcon";
import { Footer } from "../components/layouts/Footer";
import { Header } from "../components/layouts/Header";
import { Breadcrumb } from "../components/product/Breadcrumb";
import { ProductDetailInfo } from "../components/product/ProductDetailInfo";
import { ProductLoading } from "../components/product/ProductLoading";
import { Component } from "../core/Component";

export class ProductPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      product: {},
      isOpenCartModal: false,
    };

    this.on(Component.EVENTS.MOUNT, () => {
      const { productId } = this.props.router.routeParams;
      this.#loadProduct(productId);
    });
  }

  async #loadProduct(productId) {
    try {
      const product = await getProduct(productId);
      this.setState({ product, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("상품 로딩 실패:", error.message);
        this.setState({ loading: false });
      }
    }
  }

  bindEvents(element) {
    element.addEventListener("click", (e) => {
      const route = e.target.dataset.route;
      if (route) {
        this.props.router.navigate(route);
      }

      if (e.target.classList.contains("cart-modal-overlay")) {
        this.setState({ isOpenCartModal: false });
        return;
      }

      switch (e.target.id) {
        case "cart-icon-btn":
          this.setState({ isOpenCartModal: true });
          break;
        case "cart-modal-close-btn":
          this.setState({ isOpenCartModal: false });
          break;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.state.isOpenCartModal) {
          this.setState({ isOpenCartModal: false });
        }
      }
    });
  }

  render() {
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50">
        ${Header({
          leftContent: /* HTML */ `<div class="flex items-center space-x-3">
            <button data-route="/" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              ${BackArrowIcon()}
            </button>
            <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
          </div>`,
        })}

        <main class="max-w-md mx-auto px-4 py-4">
          ${this.state.loading
            ? ProductLoading()
            : /* HTML */ ` <!-- 브레드크럼 -->
                ${Breadcrumb(this.state.product)}

                <!-- 상품 상세 정보 -->
                <div class="bg-white rounded-lg shadow-sm mb-6">
                  ${ProductDetailInfo(this.state.product)}

                  <!-- 수량 선택 및 액션 -->
                  <div class="border-t border-gray-200 p-4">
                    <div class="flex items-center justify-between mb-4">
                      <span class="text-sm font-medium text-gray-900">수량</span>
                      <div class="flex items-center">
                        <button
                          id="quantity-decrease"
                          class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                        >
                          ${MinusIcon()}
                        </button>
                        <input
                          type="number"
                          id="quantity-input"
                          value="1"
                          min="1"
                          max="107"
                          class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          id="quantity-increase"
                          class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        >
                          ${PlusIcon()}
                        </button>
                      </div>
                    </div>

                    <!-- 액션 버튼 -->
                    <button
                      id="add-to-cart-btn"
                      data-product-id="85067212996"
                      class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      장바구니 담기
                    </button>
                  </div>
                </div>

                <!-- 상품 목록으로 이동 -->
                <div class="mb-6">
                  <button
                    data-route="/"
                    class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors go-to-product-list"
                  >
                    상품 목록으로 돌아가기
                  </button>
                </div>

                <!-- 관련 상품 -->
                <div class="bg-white rounded-lg shadow-sm">
                  <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
                    <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
                  </div>
                  <div class="p-4">
                    <div class="grid grid-cols-2 gap-3 responsive-grid">
                      <div
                        class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
                        data-product-id="86940857379"
                      >
                        <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                          <img
                            src="https://shopping-phinf.pstatic.net/main_8694085/86940857379.1.jpg"
                            alt="샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이"
                            class="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이
                        </h3>
                        <p class="text-sm font-bold text-blue-600">230원</p>
                      </div>
                      <div
                        class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
                        data-product-id="82094468339"
                      >
                        <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                          <img
                            src="https://shopping-phinf.pstatic.net/main_8209446/82094468339.4.jpg"
                            alt="실리카겔 50g 습기제거제 제품 /산업 신발 의류 방습제"
                            class="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          실리카겔 50g 습기제거제 제품 /산업 신발 의류 방습제
                        </h3>
                        <p class="text-sm font-bold text-blue-600">280원</p>
                      </div>
                    </div>
                  </div>
                </div>`}
        </main>

        ${Footer()}
      </div>
    `;
  }
}
