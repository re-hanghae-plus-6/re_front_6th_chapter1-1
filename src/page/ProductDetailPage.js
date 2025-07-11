import MainLayout from "../components/layout/MainLayout.js";
import RelatedProducts from "../components/product/RelatedProducts.js";
import { getProducts } from "../api/productApi.js";
import createStore from "../core/store.js";
import { getCartCount, updateCartBadge } from "../core/cart.js";
import { getAppPath } from "../core/router.js";

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
      if (getAppPath().startsWith("/product/")) {
        render(state, cartCount);
      }
    });
    if (product) initialize(product);
  };
  mount();
  return {
    html: render(store.getState(), cartCount),
    cleanup,
  };
}

function cleanup() {
  if (store) {
    store = null;
  }
}

async function initialize(product) {
  const storeRef = store;
  storeRef.setState({ product, loading: true });
  try {
    const relatedProducts = await fetchRelatedProducts(product);
    setTimeout(() => {
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
    if (store === storeRef) {
      storeRef.setState({ error: error.message, loading: false });
    }
  }
}

async function fetchRelatedProducts(product) {
  try {
    const response = await getProducts({
      category1: product.category1,
      category2: product.category2,
      limit: 20,
    });
    return response.products.filter((p) => p.productId !== product.productId);
  } catch (error) {
    console.error("관련 상품 로딩 실패:", error);
    return [];
  }
}

function render(state, cartCount) {
  cartCount = getCartCount();
  const $root = document.getElementById("root");
  let html = "";
  if (!state.product) {
    html = MainLayout({
      children: `<div class="flex justify-center items-center h-64"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`,
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
  if ($root) {
    $root.innerHTML = html;
  }
  updateCartBadge();
  if (state.product) {
    attachEventListeners();
  }
  return html;
}

function createProductDetailPageHTML({ product, relatedProducts = [], quantity = 1 }) {
  const {
    productId,
    image,
    title,
    lprice,
    mallName = "",
    rating = 4.0,
    reviewCount = 749,
    stock = 107,
    description = "",
  } = product;
  const renderStars = (rating) => {
    let stars = "";
    for (let i = 0; i < Math.floor(rating); i++)
      stars +=
        '<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
    for (let i = 0; i < 5 - Math.ceil(rating); i++)
      stars +=
        '<svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
    return stars;
  };
  const defaultDescription = `${title}에 대한 상세 설명입니다. ${mallName ? `${mallName}의` : ""} 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`;
  return `
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4"><img src="${image}" alt="${title}" class="w-full h-full object-cover product-detail-image" /></div>
        <div>
          ${mallName ? `<p class="text-sm text-gray-600 mb-1">${mallName}</p>` : ""}
          <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
          <div class="flex items-center mb-3">
            <div class="flex items-center">${renderStars(rating)}</div>
            <span class="ml-2 text-sm text-gray-600">${rating} (${reviewCount}개 리뷰)</span>
          </div>
          <div class="mb-4"><span class="text-2xl font-bold text-blue-600">${parseInt(lprice).toLocaleString()}원</span></div>
          <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>
          <div class="text-sm text-gray-700 leading-relaxed mb-6">${description || defaultDescription}</div>
        </div>
      </div>
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button>
            <input type="number" id="quantity-input" value="${quantity}" min="1" max="${stock}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
            <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
          </div>
        </div>
        <button id="add-to-cart-btn" data-product-id="${productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">장바구니 담기</button>
        <div id="cart-message" class="mt-3 text-center text-sm" style="display: none;"></div>
      </div>
    </div>
    ${RelatedProducts({ products: relatedProducts })}
  `;
}

function attachEventListeners() {
  if (!document._delegatedProductDetail) {
    document._delegatedProductDetail = true;
    document.addEventListener("click", (e) => {
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
      const cartBtn = e.target.closest("#add-to-cart-btn");
      if (cartBtn) {
        const productId = cartBtn.getAttribute("data-product-id");
        const { quantity } = store.getState();
        console.log(`[ProductDetail] Add to cart clicked – pid:${productId} qty:${quantity}`);
      }
    });
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
  const relatedProductCards = document.querySelectorAll(".related-product-card");
  relatedProductCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-product-id");
      if (!productId) return;
      window.navigateTo(`/product/${productId}`);
    });
  });
}
