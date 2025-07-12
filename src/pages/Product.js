import { getProduct, getProducts } from "../api/productApi";
import Header from "../components/Header.js";
import Loading from "../components/Loading";
import { handleAddCart } from "../js/cart.js";
import { navigate, render, getAppPath } from "../main.js";

const state = {
  isLoading: true,
  product: {},
  relatedProducts: [],
};

const methods = {
  fetchProduct: async (productId) => {
    state.product = await getProduct(productId);
  },
  fetchRelatedProducts: async (category1, category2) => {
    const products = await getProducts({ category1, category2 });
    state.relatedProducts = products.products.filter((product) => product.productId !== state.product.productId);
  },

  goToRelatedProducts: async (productId) => {
    Product.init();
    navigate.push({}, `/product/${productId}`);
    // Product.mount();
  },

  goToProductList: async () => {
    navigate.push({}, "/");
    Header.init();
    render.draw("header", Header());
    Header.mount();
    await render.view();
  },

  handleUpQuantity: () => {
    const input = document.querySelector("#quantity-input");
    input.value++;
  },

  handleDownQuantity: () => {
    const input = document.querySelector("#quantity-input");
    if (input.value === "1") return;
    input.value--;
  },

  handleAddCard: (quantity) => {
    const product = {
      ...state.product,
      quantity,
    };
    handleAddCart(product);
  },
};

Product.init = async () => {
  state.isLoading = true;
  Header.init();
  render.draw("header", Header());
};

Product.mount = async () => {
  const productId = getAppPath().match(/\d+/)[0];
  render.draw("main", Product());
  await methods.fetchProduct(productId);
  await methods.fetchRelatedProducts(state.product.category1, state.product.category);
  state.isLoading = false;

  render.draw("main", Product());

  const goToProductListBtn = document.querySelector(".go-to-product-list");
  goToProductListBtn.addEventListener("click", () => {
    methods.goToProductList();
  });

  const homeLink = document.querySelector("a");
  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    methods.goToProductList();
  });

  const quantityInput = document.querySelector("#quantity-input");
  const quantityIncrease = document.querySelector("#quantity-increase");
  const quantityDecrease = document.querySelector("#quantity-decrease");
  const cartBtn = document.getElementById("add-to-cart-btn");
  cartBtn.addEventListener("click", () => {
    methods.handleAddCard(quantityInput.value);
  });

  quantityInput.addEventListener("change", (event) => {
    if (event.target.value < 1) event.target.value = 1;
  });

  quantityIncrease.addEventListener("click", methods.handleUpQuantity);
  quantityDecrease.addEventListener("click", methods.handleDownQuantity);

  const relatedProductList = document.querySelectorAll(".related-product-card");
  relatedProductList.forEach((product) => {
    const productId = product.getAttribute("data-product-id");
    product.addEventListener("click", () => {
      methods.goToRelatedProducts(productId);
    });
  });

  // const breadcrumbBtn = document.querySelectorAll(".breadcrumb-link");
  // breadcrumbBtn.forEach((btn) => {
  // btn.addEventListener("click", (event) => {
  //   // if (btn.getAttribute("data-category2")) {
  //   //   history.pushState({}, "", `/?category1=${}`)
  //   // }
  // });
  // });
};

Product.unmount = () => {
  // 이벤트 리스너들 정리
  const goToProductListBtn = document.querySelector(".go-to-product-list");
  const homeLink = document.querySelector("a");
  const quantityInput = document.querySelector("#quantity-input");
  const quantityIncrease = document.querySelector("#quantity-increase");
  const quantityDecrease = document.querySelector("#quantity-decrease");
  const cartBtn = document.getElementById("add-to-cart-btn");
  const relatedProductList = document.querySelectorAll(".related-product-card");

  if (goToProductListBtn) {
    goToProductListBtn.removeEventListener("click", methods.goToProductList);
  }
  if (homeLink) {
    homeLink.removeEventListener("click", methods.goToProductList);
  }
  if (quantityInput) {
    quantityInput.removeEventListener("change", (event) => {
      if (event.target.value < 1) event.target.value = 1;
    });
  }
  if (quantityIncrease) {
    quantityIncrease.removeEventListener("click", methods.handleUpQuantity);
  }
  if (quantityDecrease) {
    quantityDecrease.removeEventListener("click", methods.handleDownQuantity);
  }
  if (cartBtn) {
    cartBtn.removeEventListener("click", () => {
      methods.handleAddCard(quantityInput.value);
    });
  }
  if (relatedProductList.length > 0) {
    relatedProductList.forEach((product) => {
      const productId = product.getAttribute("data-product-id");
      product.removeEventListener("click", () => {
        methods.goToRelatedProducts(productId);
      });
    });
  }
};

export default function Product() {
  return /* html */ `
    ${
      state.isLoading
        ? Loading({ type: "product" })
        : /* html */
          `
        <!-- 브레드크럼 -->
        <nav class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" data-link="home" class="hover:text-blue-600 transition-colors">홈</a>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link" data-category1="${state.product.category1}">
              ${state.product.category1}
            </button>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link" data-category2="${state.product.category2}">
              ${state.product.category2}
            </button>
          </div>
        </nav>
        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src="${state.product.image}" alt="${state.product.title}" class="w-full h-full object-cover product-detail-image">
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1"></p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${state.product.title}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                ${Array.from({ length: 5 }, (_, star) => {
                  const activeClass = star < state.product.rating ? "text-yellow-400" : "text-gray-300";
                  return /* html */ `
                    <svg class="w-4 h-4 ${activeClass}" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `;
                }).join("")}
                
                </div>
                <span class="ml-2 text-sm text-gray-600">${state.product.rating}.0 (${state.product.reviewCount}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${state.product.lprice}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">
              재고 ${state.product.stock}개
              </div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">
                ${state.product.description}
              </div>
            </div>
          </div>
          <!-- 수량 선택 및 액션 -->
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
                <input type="number" id="quantity-input" value="1" min="1" max="107" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
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
            <button id="add-to-cart-btn" data-product-id="85067212996" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium">
              장바구니 담기
            </button>
          </div>
        </div>
        <!-- 상품 목록으로 이동 -->
        <div class="mb-6">
          <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
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
              ${state.relatedProducts
                .map(
                  (product) => /* html */ `
              <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${product.productId}">
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
                <p class="text-sm font-bold text-blue-600">${product.lprice}원</p>
              </div>
                `,
                )
                .join("")}

            </div>
          </div>
        </div>
      `
    }
  `;
}
