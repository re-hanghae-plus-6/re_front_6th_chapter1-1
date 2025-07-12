import { getProduct, getProducts } from "../api/productApi";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loading";
import ProductDetailHeader from "../components/common/ProductDetailHeader";
import MinusIcon from "../components/icon/MinusIcon";
import PlusIcon from "../components/icon/PlusIcon";
import StarEmpty from "../components/icon/StarEmpty";
import StarFilled from "../components/icon/StarFilled";
import { DEFAULT_LIMIT, DEFAULT_PAGE, MIN_QUANTITY } from "../constants";
import { useNavigate, useParam } from "../hook/useRouter";
import Component from "../lib/Component";
import { homeStore } from "../store/homeStore";
import { formatPrice } from "../utils/formatNumber";
import getFilter from "../utils/getFilter";

const CHILD_COMPONENT = {
  HEADER: "header",
};

export default class ProductDetailPage extends Component {
  setup() {
    const [param] = useParam("id");

    this.state = {
      productId: param,
      product: {},
      relatedProducts: [],
      isLoading: false,
      isRelatedProductsLoading: false,
      quantity: MIN_QUANTITY,
    };

    this.fetchProduct();
    this.fetchRelatedProducts();
  }

  async fetchProduct() {
    if (this.stateisLoading) return;

    this.setState({
      isLoading: true,
    });

    const product = await getProduct(this.state.productId);

    this.setState({
      product,
      isLoading: false,
    });
  }

  async fetchRelatedProducts() {
    const { category1, category2 } = getFilter();

    if (this.state.isRelatedProductsLoading) return;

    this.setState({
      isRelatedProductsLoading: true,
    });

    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      search: "",
      category1,
      category2,
    };

    const { products } = await getProducts(params);
    const filteredProducts = products.filter(
      (product) => product.productId !== this.state.productId,
    );

    this.setState({
      relatedProducts: filteredProducts,
      isRelatedProductsLoading: false,
    });
  }

  handleRelatedProductClick(e) {
    e.stopPropagation();
    const { navigate } = useNavigate();

    const $relatedProductCard = e.target.closest(".related-product-card");
    if ($relatedProductCard) {
      const productId = $relatedProductCard.dataset["productId"];
      navigate(`/product/${productId}`);
    }
  }

  handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("add to cart");
    homeStore.setState({
      cart: {
        items: [
          ...homeStore.getState().cart.items,
          { ...this.state.product, quantity: this.state.quantity },
        ],
      },
    });
  };

  handleClickIncrease() {
    const $quantityInput = document.querySelector("#quantity-input");
    const $increateButton = document.querySelector("#quantity-increase");
    if (!$quantityInput || !$increateButton) return;

    $increateButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setState({
        quantity: Math.min(this.state.quantity + 1, this.state.product.stock),
      });
    });
  }

  handleClickDecrease() {
    const $quantityInput = document.querySelector("#quantity-input");
    const $decreaseButton = document.querySelector("#quantity-decrease");
    if (!$quantityInput || !$decreaseButton) return;

    $decreaseButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setState({
        quantity: Math.max(this.state.quantity - 1, MIN_QUANTITY),
      });
    });
  }

  handleGoToProductList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { navigate } = useNavigate();
    navigate("/");
  };

  setEvent() {
    if (this.state.isLoading || this.state.isRelatedProductsLoading) return;

    this.$target.querySelectorAll(".related-product-card").forEach((card) => {
      card.addEventListener("click", this.handleRelatedProductClick);
    });
    this.$target.querySelector("#add-to-cart-btn").addEventListener("click", this.handleAddToCart);
    this.$target
      .querySelector(".go-to-product-list")
      .addEventListener("click", this.handleGoToProductList);

    this.handleClickIncrease();
    this.handleClickDecrease();
  }

  cleanup() {
    // 기존 이벤트 리스너 제거
    this.$target.querySelectorAll(".related-product-card").forEach((card) => {
      card.removeEventListener("click", this.handleRelatedProductClick);
    });

    const addToCartBtn = this.$target.querySelector("#add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.removeEventListener("click", this.handleAddToCart);
    }

    const goToProductListBtn = this.$target.querySelector(".go-to-product-list");
    if (goToProductListBtn) {
      goToProductListBtn.removeEventListener("click", this.handleGoToProductList);
    }

    // 수량 조절 버튼 이벤트 리스너 제거
    const increaseBtn = this.$target.querySelector("#quantity-increase");
    const decreaseBtn = this.$target.querySelector("#quantity-decrease");

    if (increaseBtn && this.increaseHandler) {
      increaseBtn.removeEventListener("click", this.increaseHandler);
    }
    if (decreaseBtn && this.decreaseHandler) {
      decreaseBtn.removeEventListener("click", this.decreaseHandler);
    }

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  starTemplate() {
    const filledStars = Math.floor(this.state.product.rating || 0); // rating이 없으면 0으로 처리
    const emptyStars = 5 - filledStars;

    let starsHTML = "";

    // 채워진 별들
    for (let i = 0; i < filledStars; i++) {
      starsHTML += StarFilled();
    }

    // 빈 별들
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += StarEmpty();
    }

    return /* HTML */ `<div class="flex items-center">${starsHTML}</div>`;
  }

  mounted() {
    if (this.state.isLoading || this.state.isRelatedProductsLoading) return;

    const $headerContainer = document.querySelector("#detail-header-container");

    if (!this.child.get(CHILD_COMPONENT.HEADER)) {
      const headerInstance = new ProductDetailHeader($headerContainer);
      this.addChild(headerInstance, CHILD_COMPONENT.HEADER);
    } else {
      const headerInstance = this.child.get(CHILD_COMPONENT.HEADER);
      headerInstance.$target = $headerContainer;
      headerInstance.render();
    }
  }

  relatedProductTemplate(product) {
    const { productId, image, title, lprice } = product;

    return /* HTML */ `<div
      class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
      data-product-id="${productId}"
    >
      <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
        <img src="${image}" alt="${title}" class="w-full h-full object-cover" loading="lazy" />
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${title}</h3>
      <p class="text-sm font-bold text-blue-600">${lprice}원</p>
    </div>`;
  }

  template() {
    const { product, relatedProducts, isLoading, isRelatedProductsLoading } = this.state;
    const { productId, image, title, lprice, stock, description, rating, reviewCount } = product;

    if (isLoading || isRelatedProductsLoading) {
      return Loading();
    }

    return /* HTML */ `<div class="min-h-screen bg-gray-50">
      <div id="detail-header-container"></div>

      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 브레드크럼 -->

        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src="${image}"
                alt="${title}"
                class="w-full h-full object-cover product-detail-image"
              />
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1"></p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                ${this.starTemplate()}
                <span class="ml-2 text-sm text-gray-600">${rating} (${reviewCount}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${formatPrice(lprice)}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">${description}</div>
            </div>
          </div>
          <!-- 수량 선택 및 액션 -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-900">수량</span>
              <div class="flex items-center">
                <button
                  id="quantity-decrease"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 
                     rounded-l-md bg-gray-50 hover:bg-gray-100"
                >
                  ${MinusIcon()}
                </button>
                <input
                  type="number"
                  id="quantity-input"
                  value="${this.state.quantity}"
                  min="1"
                  max="${stock}"
                  class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  id="quantity-increase"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 
                     rounded-r-md bg-gray-50 hover:bg-gray-100"
                >
                  ${PlusIcon()}
                </button>
              </div>
            </div>
            <!-- 액션 버튼 -->
            <button
              id="add-to-cart-btn"
              data-product-id=${productId}
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                   hover:bg-blue-700 transition-colors font-medium"
            >
              장바구니 담기
            </button>
          </div>
        </div>
        <!-- 상품 목록으로 이동 -->
        <div class="mb-6">
          <button
            class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
              hover:bg-gray-200 transition-colors go-to-product-list"
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
              ${relatedProducts.map(this.relatedProductTemplate).join("")}
            </div>
          </div>
        </div>
      </main>
      ${Footer()}
    </div>`;
  }
}
