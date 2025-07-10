import MainLayout from "../components/layout/MainLayout.js";
import RelatedProducts from "../components/product/RelatedProducts.js";
import { getProducts } from "../api/productApi.js";
import createStore from "../core/store.js";
import { getCartCount, updateCartBadge } from "../core/cart.js";

// 상품 상세 페이지 초기 상태
const initialState = {
  product: null,
  relatedProducts: [],
  relatedLoaded: false,
  quantity: 1,
  loading: false,
  error: null,
};

let store = null;

export default function ProductDetailPage({ product, cartCount = 0 }) {
  const mount = () => {
    if (store) cleanup();

    store = createStore(initialState);

    store.subscribe(() => {
      const state = store.getState();
      if (window.location.pathname.startsWith("/product/")) {
        render(state, cartCount);
      }
    });

    if (product) initialize(product);
  };

  mount();
  return {
    html: render(store.getState(), cartCount),
    cleanup: () => {
      cleanup();
    },
  };
}

// 스토어 정리 함수
function cleanup() {
  if (store) {
    store = null;
  }
}

// 초기 데이터 로딩
async function initialize(product) {
  // 현재 스토어 참조를 캡처하여 나중에 비교합니다.
  const storeRef = store;

  storeRef.setState({
    product,
    loading: true,
  });

  try {
    // 관련 상품 데이터 조회
    const relatedProducts = await fetchRelatedProducts(product);

    // 다음 이벤트 루프로 지연시켜 초기 렌더 이후에 관련 상품이 표시되도록 함
    setTimeout(() => {
      // 스토어가 교체되지 않았는지 확인 (네비게이션/cleanup 등으로 새 스토어가 만들어진 경우 무시)
      if (store === storeRef) {
        storeRef.setState({
          relatedProducts,
          relatedLoaded: true,
          loading: false,
        });
      }
    }, 0);
  } catch (error) {
    console.error("관련 상품 로딩 실패:", error);
    // 동일하게 스토어가 여전히 유효한지 확인
    if (store === storeRef) {
      storeRef.setState({
        error: error.message,
        loading: false,
      });
    }
  }
}

// 관련 상품 가져오기 함수
async function fetchRelatedProducts(product) {
  try {
    const response = await getProducts({
      category1: product.category1,
      category2: product.category2,
      limit: 20, // 현재 상품 제외하고 19개 가져오기 위해 20개 요청
    });

    // 현재 상품을 제외한 관련 상품 반환
    return response.products.filter((p) => p.productId !== product.productId);
  } catch (error) {
    console.error("관련 상품 로딩 실패:", error);
    return [];
  }
}

// 렌더링 함수
function render(state, cartCount) {
  cartCount = getCartCount();
  const $root = document.getElementById("root");
  let html = "";

  // 로딩 중인 경우
  if (!state.product) {
    html = MainLayout({
      /* HTML */
      children: `<div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>`,
      cartCount,
      showBackButton: true,
      title: "상품 상세",
    });
  } else {
    html = MainLayout({
      children: createProductDetailPageHTML({
        product: state.product,
        relatedProducts: state.relatedProducts,
        quantity: state.quantity,
      }),
      cartCount,
      showBackButton: true,
      title: "상품 상세",
    });
  }

  // DOM 업데이트
  if ($root) {
    $root.innerHTML = html;
  }

  // 헤더 렌더 이후 뱃지 동기화
  updateCartBadge();

  // 이벤트 리스너 부착 DOM이 그려지고 난 뒤
  if (state.product) {
    attachEventListeners();
  }

  return html;
}

// 상품 상세 페이지 HTML 생성 함수
function createProductDetailPageHTML({ product, relatedProducts = [], quantity = 1 }) {
  const {
    productId,
    image,
    title,
    lprice,
    mallName = "",
    // 가상의 추가 정보들
    rating = 4.0,
    reviewCount = 749,
    stock = 107,
    description = "",
  } = product;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - Math.ceil(rating);

    let stars = "";
    for (let i = 0; i < fullStars; i++) {
      stars += `
        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      `;
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += `
        <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      `;
    }
    return stars;
  };

  const defaultDescription = `${title}에 대한 상세 설명입니다. ${mallName ? `${mallName}의` : ""} 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`;

  return /* HTML */ `
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="${image}" alt="${title}" class="w-full h-full object-cover product-detail-image" />
        </div>

        <!-- 상품 정보 -->
        <div>
          ${mallName ? `<p class="text-sm text-gray-600 mb-1">${mallName}</p>` : ""}
          <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>

          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">${renderStars(rating)}</div>
            <span class="ml-2 text-sm text-gray-600">${rating} (${reviewCount}개 리뷰)</span>
          </div>

          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${parseInt(lprice).toLocaleString()}원</span>
          </div>

          <!-- 재고 -->
          <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>

          <!-- 설명 -->
          <div class="text-sm text-gray-700 leading-relaxed mb-6">${description || defaultDescription}</div>
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input
              type="number"
              id="quantity-input"
              value="${quantity}"
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <button
          id="add-to-cart-btn"
          data-product-id="${productId}"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                       hover:bg-blue-700 transition-colors font-medium"
        >
          장바구니 담기
        </button>

        <!-- 메시지 표시 영역 -->
        <div id="cart-message" class="mt-3 text-center text-sm" style="display: none;"></div>
      </div>
    </div>
    ${RelatedProducts({ products: relatedProducts })}
  `;
}

// 이벤트 리스너 등록 함수
function attachEventListeners() {
  if (!document._delegatedProductDetail) {
    document._delegatedProductDetail = true;

    document.addEventListener("click", (e) => {
      // 수량 감소
      const decBtn = e.target.closest("#quantity-decrease");
      if (decBtn) {
        const quantityInputEl = document.querySelector("#quantity-input");
        if (!quantityInputEl) return;
        const currentValue = parseInt(quantityInputEl.value);
        if (currentValue > 1) {
          const newQuantity = currentValue - 1;
          store.setState({ quantity: newQuantity });
          quantityInputEl.value = newQuantity;
        }
        return;
      }

      // 수량 증가
      const incBtn = e.target.closest("#quantity-increase");
      if (incBtn) {
        const quantityInputEl = document.querySelector("#quantity-input");
        if (!quantityInputEl) return;
        const currentValue = parseInt(quantityInputEl.value);
        const maxValue = parseInt(quantityInputEl.getAttribute("max"));
        if (currentValue < maxValue) {
          const newQuantity = currentValue + 1;
          store.setState({ quantity: newQuantity });
          quantityInputEl.value = newQuantity;
        }
        return;
      }

      // 장바구니 담기
      const cartBtn = e.target.closest("#add-to-cart-btn");
      if (cartBtn) {
        console.log("[AddToCart] clicked (delegated)");
        const productId = cartBtn.getAttribute("data-product-id");
        const { quantity } = store.getState();
        console.log(`상품 ${productId}를 ${quantity}개 장바구니에 추가`);
        showMessage("장바구니에 추가되었습니다");
      }
    });

    // 직접 입력 수량 변경
    document.addEventListener("input", (e) => {
      if (e.target.id === "quantity-input") {
        const value = parseInt(e.target.value);
        const maxValue = parseInt(e.target.getAttribute("max"));
        if (value >= 1 && value <= maxValue) {
          store.setState({ quantity: value });
        }
      }
    });
  }

  // 관련 상품 클릭 이벤트
  const relatedProductCards = document.querySelectorAll(".related-product-card");
  relatedProductCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-product-id");
      if (!productId) return;
      window.navigateTo(`/product/${productId}`);
    });
  });
}

// 메시지 표시 함수
function showMessage(message) {
  const messageElement = document.getElementById("cart-message");
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = "mt-3 text-center text-sm text-green-600 font-medium";
    messageElement.style.display = "block";

    // 3초 후 메시지 숨기기
    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }

  // 추가로 Toast도 표시 (테스트 호환성을 위해)
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) {
    existingToast.remove();
  }

  const toastElement = document.createElement("div");
  toastElement.className =
    "toast-message fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg";
  toastElement.textContent = message;

  document.body.appendChild(toastElement);

  // 3초 후 자동 제거
  setTimeout(() => {
    if (toastElement.parentNode) {
      toastElement.parentNode.removeChild(toastElement);
    }
  }, 3000);
}
