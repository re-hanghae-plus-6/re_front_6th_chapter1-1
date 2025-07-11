import { getProduct } from "../api/productApi.js";
import { Header } from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Router } from "../router/router.js";
import Toast from "../components/layout/Toast.js";
import { getProducts } from "../api/productApi.js";
// 상품 상세 데이터
let data = null;
let isLoading = false;

const getData = async (id) => {
  try {
    isLoading = true;
    const product = await getProduct(id);
    isLoading = false;
    return product;
  } catch (error) {
    isLoading = false;
    console.error(error);
  }
};

const getRelatedProducts = async (category1, category2) => {
  const relatedProducts = await getProducts({ category1, category2 });
  return relatedProducts;
};
const productUI = (product) => {
  if (isLoading || !product)
    return /* HTML */ `
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    `;
  else
    return /* HTML */ `
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <!-- 상품 이미지 -->
        <div class="p-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src="${product.image}"
              alt="${product.title}"
              class="w-full h-full object-cover product-detail-image"
            />
          </div>
          <!-- 상품 정보 -->
          <div>
            <p class="text-sm text-gray-600 mb-1"></p>
            <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
            <!-- 평점 및 리뷰 -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">${starUI(product.rating)}</div>
              <span class="ml-2 text-sm text-gray-600">${product.rating} (${product.reviewCount}개 리뷰)</span>
            </div>
            <!-- 가격 -->
            <div class="mb-4">
              <span class="text-2xl font-bold text-blue-600">${product.lprice}원</span>
            </div>
            <!-- 재고 -->
            <div class="text-sm text-gray-600 mb-4">${product.stock}개</div>
            <!-- 설명 -->
            <div class="text-sm text-gray-700 leading-relaxed mb-6">${product.description}</div>
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
                value="1"
                min="1"
                max="107"
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
            data-product-id="85067212996"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium"
          >
            장바구니 담기
          </button>
        </div>
      </div>
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
        <div class="p-4" id="related-products-container"></div>
      </div>
    `;
};
const starUI = (rating) => {
  const starCount = Array.from({ length: 5 }, (_, index) => {
    const starClass = index < rating ? "text-yellow-400" : "text-gray-300";
    return /* HTML */ `
      <svg class="w-4 h-4 ${starClass}" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path>
      </svg>
    `;
  });
  return starCount.join("");
};

const loadRelatedData = async (product) => {
  try {
    const relatedProducts = await getRelatedProducts(product.category1, product.category2);
    // console.log(relatedProducts);
    const filteredProducts = relatedProducts.products.filter(
      (relatedProduct) => relatedProduct.productId !== product.productId,
    );
    // console.log(filteredProducts);
    const relatedContainer = document.querySelector("#related-products-container");

    if (relatedContainer && filteredProducts.length > 0) {
      relatedContainer.innerHTML = /* HTML */ `
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
          <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
        </div>
        <div class="grid grid-cols-2 gap-3 responsive-grid">
          ${filteredProducts
            .map((product) => {
              return /* HTML */ `
                <div
                  class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
                  data-product-id="${product.productId}"
                >
                  <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                    <img
                      src="${product.image}"
                      alt="${product.title}"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
                  <p class="text-sm font-bold text-blue-600">${parseInt(product.lprice).toLocaleString("ko-KR")}원</p>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
      setupRelatedProductEvents();
    }
  } catch (error) {
    console.error(error);
  }
};
const setupRelatedProductEvents = () => {
  const router = Router();
  const relatedCards = document.querySelectorAll(".related-product-card");
  relatedCards.forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      router.navigate(`/product/${productId}`);
    });
  });
};

const updateUI = (product) => {
  const mainEl = document.querySelector("main");

  if (mainEl) {
    mainEl.innerHTML = /* HTML */ `
      <main class="max-w-md mx-auto px-4 py-4">${breadcrumbUI(product)}${productUI(product, [])}</main>
    `;
    loadRelatedData(product);
  }
};

const breadcrumbUI = (product) => {
  return /* HTML */ `
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category1="${product.category1}">${product.category1}</button>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <button class="breadcrumb-link" data-category2="${product.category2}">${product.category2}</button>
      </div>
    </nav>
  `;
};

function ProductPage() {
  const router = Router();

  const setupToast = () => {
    let toast = document.getElementById("toast-container");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-container";
      toast.className = "fixed top-4 right-4 z-50";
      document.body.appendChild(toast);
    }

    const toastHTML = Toast();
    toast.innerHTML = toastHTML;
    const closeBtn = document.getElementById("toast-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        toast.innerHTML = "";
      });
    }
    // 3초 후 자동으로 사라지기
    setTimeout(() => {
      if (toast) {
        toast.innerHTML = "";
      }
    }, 3000);
  };

  const setupEvent = () => {
    const goBackBtn = document.querySelector(".go-to-product-list");
    if (goBackBtn) {
      goBackBtn.addEventListener("click", () => {
        router.navigate("/");
      });
    }
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        setupToast();
      });
    }

    const quantityInput = document.querySelector("#quantity-input");
    const decreaseBtn = document.querySelector("#quantity-decrease");
    const increaseBtn = document.querySelector("#quantity-increase");

    if (decreaseBtn && quantityInput) {
      decreaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);

        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
    }

    if (increaseBtn && quantityInput) {
      increaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.max);
        if (currentValue < maxValue) {
          quantityInput.value = currentValue + 1;
        }
      });
    }
  };

  const setup = async (params = {}) => {
    const { id } = params;

    data = await getData(id);

    updateUI(data);
    setupEvent();
  };

  const render = () => {
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50">
        ${Header("상품 상세")}
        <main class="max-w-md mx-auto px-4 py-4">${productUI(null)}</main>
        ${Footer()}
      </div>
    `;
  };

  const cleanup = () => {
    data = null;
  };

  return {
    setup,
    cleanup,
    setupEvent,
    render,
  };
}

export default ProductPage;
