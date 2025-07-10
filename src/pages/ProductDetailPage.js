import { Header } from "../app/components/Header.js";
import { Footer } from "../app/components/Footer.js";
import { Breadcrumb } from "../shared/components/Breadcrumb.js";
import { productDetailStore } from "../features/product/store/productDetailStore.js";
import { getProduct, getProducts } from "../api/productApi.js";
import { useParams, router } from "../router.js";
import { addEvent } from "../utils/eventManager.js";
import { updateElement } from "../utils/domUtils.js";
import { addToCart } from "../features/cart/services/cartService.js";
import { showSuccessToast } from "../utils/toastManager.js";

const renderLoadingContent = () => {
  return `
    <div class="py-20 bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
    </div>
  `;
};

const renderBreadcrumb = (product) => {
  return Breadcrumb({
    items: [
      { label: "홈", href: "/", isLink: true },
      {
        label: product.category1 || "생활/건강",
        isLink: false,
        category1: product.category1 || "생활/건강",
      },
      {
        label: product.category2 || "생활용품",
        isLink: false,
        category2: product.category2 || "생활용품",
      },
    ],
  });
};

const renderProductInfo = (product) => {
  return `
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover product-detail-image">
        </div>
        <!-- 상품 정보 -->
        <div>
          <p class="text-sm text-gray-600 mb-1">${product.brand || ""}</p>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">
              ${generateStars(product.rating || 4)}
            </div>
            <span class="ml-2 text-sm text-gray-600">${product.rating || 4.0} (${product.reviewCount || 749}개 리뷰)</span>
          </div>
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600">${parseInt(product.lprice).toLocaleString()}원</span>
          </div>
          <!-- 재고 -->
          <div class="text-sm text-gray-600 mb-4">
            재고 ${product.stock || 0}개
          </div>
          <!-- 설명 -->
          <div class="text-sm text-gray-700 leading-relaxed mb-6">
            ${product.description || product.name + "에 대한 상세 설명입니다. 브랜드의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다."}
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderQuantitySection = (product, quantity) => {
  return `
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
               rounded-l-md bg-gray-50 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input type="number" id="quantity-input" value="${quantity}" min="1" max="${product.stock || 1}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
              focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
               rounded-r-md bg-gray-50 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 액션 버튼 -->
        <button id="add-to-cart-btn" data-product-id="${product.id}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
             hover:bg-blue-700 transition-colors font-medium">
          장바구니 담기
        </button>
      </div>
    </div>
  `;
};

const renderBackButton = () => {
  return `
    <div class="mb-6">
      <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
        hover:bg-gray-200 transition-colors go-to-product-list">
        상품 목록으로 돌아가기
      </button>
    </div>
  `;
};

const renderRelatedProducts = (relatedProducts) => {
  return `
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
        <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-3 responsive-grid">
          ${relatedProducts
            .map(
              (product) => `
            <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${product.productId}">
              <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" loading="lazy">
              </div>
              <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
              <p class="text-sm font-bold text-blue-600">${parseInt(product.lprice).toLocaleString()}원</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
};

const renderProductContent = (product, relatedProducts, quantity) => {
  if (!product) return renderLoadingContent();

  return `
    <!-- 브레드크럼 -->
    <div id="breadcrumb-section">
      ${renderBreadcrumb(product)}
    </div>
    <!-- 상품 정보 -->
    <div id="product-info-section">
      ${renderProductInfo(product)}
    </div>
    <!-- 수량 선택 및 액션 -->
    <div id="quantity-section">
      ${renderQuantitySection(product, quantity)}
    </div>
    <!-- 상품 목록으로 이동 -->
    <div id="back-button-section">
      ${renderBackButton()}
    </div>
    <!-- 관련 상품 -->
    <div id="related-products-section">
      ${relatedProducts && relatedProducts.length > 0 ? renderRelatedProducts(relatedProducts) : ""}
    </div>
  `;
};

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
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

const loadProductDetail = async (productId) => {
  try {
    productDetailStore.setState({
      isLoading: true,
      error: null,
      relatedProducts: [],
      isLoadingRelated: false,
    });

    const product = await getProduct(productId);

    productDetailStore.setState({
      product,
      isLoading: false,
      error: null,
    });

    loadRelatedProducts(product);
  } catch (error) {
    console.error("상품 상세 정보 로딩 실패:", error);
    productDetailStore.setState({
      isLoading: false,
      error: error.message,
    });
  }
};

const loadRelatedProducts = async (product) => {
  try {
    productDetailStore.setState({ isLoadingRelated: true });

    const relatedProductsResponse = await getProducts({
      category1: product.category1,
      category2: product.category2,
      limit: 20,
      page: 1,
    });

    const relatedProducts = relatedProductsResponse.products.filter((p) => p.productId !== product.productId);

    productDetailStore.setState({
      relatedProducts,
      isLoadingRelated: false,
    });
  } catch (error) {
    console.error("관련 상품 로딩 실패:", error);
    productDetailStore.setState({
      isLoadingRelated: false,
    });
  }
};

const setupEventHandlers = () => {
  addEvent("click", "#quantity-decrease", () => {
    const state = productDetailStore.getState();
    const newQuantity = Math.max(1, state.quantity - 1);
    productDetailStore.setState({ quantity: newQuantity });
    document.getElementById("quantity-input").value = newQuantity;
  });

  addEvent("click", "#quantity-increase", () => {
    const state = productDetailStore.getState();
    const maxQuantity = state.product?.stock || 1;
    const newQuantity = Math.min(maxQuantity, state.quantity + 1);
    productDetailStore.setState({ quantity: newQuantity });
    document.getElementById("quantity-input").value = newQuantity;
  });

  addEvent("change", "#quantity-input", (event) => {
    const state = productDetailStore.getState();
    const maxQuantity = state.product?.stock || 1;
    const newQuantity = Math.min(maxQuantity, Math.max(1, parseInt(event.target.value) || 1));
    productDetailStore.setState({ quantity: newQuantity });
    event.target.value = newQuantity;
  });

  addEvent("click", ".go-to-product-list", () => {
    window.history.back();
  });

  addEvent("click", ".related-product-card", (event) => {
    const productId = event.target.closest(".related-product-card").dataset.productId;
    router.get().push(`/product/${productId}`);
  });

  addEvent("click", ".breadcrumb-link", (event) => {
    const category1 = event.target.dataset.category1;
    const category2 = event.target.dataset.category2;

    if (category1) {
      router.get().push(`/?category1=${category1}`);
    } else if (category2) {
      router.get().push(`/?category2=${category2}`);
    }
  });

  addEvent("click", "#add-to-cart-btn", () => {
    const state = productDetailStore.getState();
    if (state.product) {
      addToCart(state.product, state.quantity);
      showSuccessToast("장바구니에 추가되었습니다");
    }
  });
};

let storeUnsubscribe = null;

const setupStateSubscriptions = () => {
  return productDetailStore.subscribe((newState, prevState) => {
    if (!prevState || newState.isLoading !== prevState.isLoading) {
      const $main = document.querySelector("main");
      if ($main) {
        if (newState.isLoading) {
          updateElement("main", renderLoadingContent());
        } else if (newState.product) {
          updateElement("main", renderProductContent(newState.product, newState.relatedProducts, newState.quantity));
        }
      }
    }

    if (!newState.isLoading && (!prevState || newState.product !== prevState.product)) {
      if (newState.product) {
        updateElement("#breadcrumb-section", renderBreadcrumb(newState.product));
        updateElement("#product-info-section", renderProductInfo(newState.product));
        updateElement("#quantity-section", renderQuantitySection(newState.product, newState.quantity));
      }
    }

    if (
      !newState.isLoading &&
      (!prevState ||
        newState.relatedProducts !== prevState.relatedProducts ||
        newState.isLoadingRelated !== prevState.isLoadingRelated)
    ) {
      if (!newState.isLoadingRelated && newState.relatedProducts && newState.relatedProducts.length > 0) {
        updateElement("#related-products-section", renderRelatedProducts(newState.relatedProducts));
      } else {
        updateElement("#related-products-section", "");
      }
    }

    if (!newState.isLoading && (!prevState || newState.quantity !== prevState.quantity)) {
      const $quantityInput = document.querySelector("#quantity-input");
      if ($quantityInput) {
        $quantityInput.value = newState.quantity;
      }
    }
  });
};

export const ProductDetailPage = () => {
  const state = productDetailStore.getState();

  return `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title: "상품 상세", showBackButton: true })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${state.isLoading ? renderLoadingContent() : renderProductContent(state.product, state.relatedProducts, state.quantity)}
      </main>
      ${Footer()}
    </div>
  `;
};

ProductDetailPage.onMount = () => {
  const params = useParams();
  const productId = params.id;

  if (!productId) {
    console.error("상품 ID가 없습니다.");
    return;
  }

  storeUnsubscribe = setupStateSubscriptions();
  setupEventHandlers();
  loadProductDetail(productId);
};

ProductDetailPage.onUnmount = () => {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
};
