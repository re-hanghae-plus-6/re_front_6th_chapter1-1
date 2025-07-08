import { render } from "../utils/render";
import { productDetailState } from "../states/productState";
import { getProduct, getProducts } from "../api/productApi";
import { Rating } from "../components/Rating/Rating";
import { Header } from "../components/Layout/Header";
import { Footer } from "../components/Layout/Footer";
import { RelatedProductSection } from "../components/RelatedProductSection/RelatedProductSection";
import { navigate } from "../utils/navigate";

function renderProductPage(state) {
  const { isLoading, product, relatedProducts } = state;

  render(/* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ type: "product" })}
      ${isLoading
        ? `<main class="max-w-md mx-auto px-4 py-4">
        <div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>
      </main>`
        : `<main class="max-w-md mx-auto px-4 py-4">
        <!-- 브레드크럼 -->
        <nav class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link" data-category1="${product.category1}">
              ${product.category1}
            </button>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link" data-category2="${product.category2}">
              ${product.category2}
            </button>
          </div>
        </nav>
        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover product-detail-image">
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1"></p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${product.title}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                ${Rating(product.rating)}
                <span class="ml-2 text-sm text-gray-600">${product.rating}.0 (${product.reviewCount}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${product.lprice}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">
                재고 ${product.stock}개
              </div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">
                ${product.description}
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
                <input type="number" id="quantity-input" value="1" min="1" max="${product.stock}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
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
        ${RelatedProductSection({ products: relatedProducts })}
      </main>`}
      ${Footer()}
    </div>
  `);

  addEvents();
}
export async function Product(productId) {
  productDetailState.isLoading = true;
  renderProductPage(productDetailState);

  try {
    const productData = await getProduct(productId);
    productDetailState.product = productData;

    const relatedProductList = await getProducts({
      category1: productData.category1,
      category2: productData.category2,
      limit: 5,
    });

    productDetailState.relatedProducts =
      relatedProductList.products.filter((product) => product.productId !== productId).slice(0, 4) || [];

    productDetailState.isLoading = false;
    renderProductPage(productDetailState);
  } catch (e) {
    console.error(e);
  }
}

function addEvents() {
  document.querySelector(".go-to-product-list")?.addEventListener("click", () => {
    navigate("/");
  });

  document.querySelectorAll(".breadcrumb-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const category1 = target.dataset.category1;
      const category2 = target.dataset.category2;

      if (category1) {
        navigate(`/?category1=${encodeURIComponent(category1)}`);
      } else if (category2) {
        const currentBtn = target.closest(".text-sm");
        const prevBtn = currentBtn.querySelector("[data-category1]");
        const prevCategory1 = prevBtn?.dataset.category1;

        if (prevCategory1) {
          navigate(`/?category1=${encodeURIComponent(prevCategory1)}&category2=${encodeURIComponent(category2)}`);
        }
      }
    });
  });

  const quantityInput = document.querySelector("#quantity-input");
  const maxStock = parseInt(quantityInput?.max) || 1;
  if (quantityInput) {
    quantityInput.addEventListener("input", () => {
      const value = parseInt(quantityInput.value);
      if (value < 1 || value > maxStock) {
        quantityInput.value = 1;
      }
    });
  }

  const decreaseBtn = document.querySelector("#quantity-decrease");
  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      const current = parseInt(quantityInput.value) || 1;
      if (current > 1) {
        quantityInput.value = current - 1;
      }
    });
  }

  const increaseBtn = document.querySelector("#quantity-increase");
  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      const current = parseInt(quantityInput.value) || 1;
      if (current < maxStock) {
        quantityInput.value = current + 1;
      }
    });
  }
}
