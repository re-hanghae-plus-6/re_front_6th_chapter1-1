import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductDetail from "../components/detail/ProductDetail.js";
import RelatedProduct from "../components/detail/RelatedProduct.js";
import Breadcrumb from "../components/detail/Breadcrumb.js";
import { getProduct, getProducts } from "../api/productApi.js";
import { router } from "../router.js";
import { productStore } from "../store/productStore.js";
import { cartStore } from "../store/cartStore.js";
import { updateQueryParams } from "../utils/urlParam.js";
import { CartIcon } from "../components/common/Header.js";

export default function Detail(params = {}) {
  const { productId } = params;

  const template = `
    <div class="min-h-screen bg-gray-50">
      ${Header("detail")}
      <main class="max-w-md mx-auto px-4 py-4">
        <div id="breadcrumb-container">
        </div>
        
        <!-- 상품 상세 정보 -->
        <div id="product-detail-container">
          <!-- 로딩 상태 -->
          <div class="py-20 bg-gray-50 flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">상품 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
        
        <!-- 관련 상품 -->
        <div id="related-product-container">
        </div>
      </main>
      ${Footer()}
    </div>
  `;

  // 장바구니 카운트 업데이트
  function updateCartCount() {
    const cartState = cartStore.getState();
    const cartIconContainer = document.getElementById("cart-icon-container");

    if (cartIconContainer) {
      cartIconContainer.innerHTML = CartIcon(cartState.totalCount);
    }
  }

  async function mount() {
    updateCartCount();

    async function loadProduct() {
      try {
        const product = await getProduct(productId);

        if (product) {
          // 브레드크럼
          const breadcrumbContainer = document.getElementById("breadcrumb-container");
          if (breadcrumbContainer) {
            breadcrumbContainer.innerHTML = Breadcrumb(product.category1, product.category2);
          }

          // 상세
          const productDetailContainer = document.getElementById("product-detail-container");
          if (productDetailContainer) {
            productDetailContainer.innerHTML = ProductDetail(product);
          }

          // 관련 상품 로드
          await loadRelatedProducts(product);

          // 이벤트 리스너 등록
          ProductDetailEventListeners();
        }
      } catch (error) {
        console.error("상품 상세 로드 에러:", error);
      }
    }

    async function loadRelatedProducts(currentProduct) {
      const relatedProductsResponse = await getProducts({
        category1: currentProduct.category1,
        category2: currentProduct.category2,
      });

      const relatedProducts =
        relatedProductsResponse.products?.filter((product) => product.productId !== currentProduct.productId) || [];

      const relatedProductContainer = document.getElementById("related-product-container");
      if (relatedProductContainer) {
        relatedProductContainer.innerHTML = RelatedProduct(relatedProducts.slice(0, 4));
      }
    }

    await loadProduct();

    function ProductDetailEventListeners() {
      document.getElementById("back-button").addEventListener("click", () => {
        window.history.pushState({}, "", "/");
        router();
      });

      // 브레드크럼 클릭 이벤트
      document.addEventListener("click", (e) => {
        const target = e.target;

        if (target.closest("#home-breadcrumb-link")) {
          e.preventDefault();
          window.history.pushState({}, "", "/");
          router();
          return;
        }

        if (target.classList.contains("breadcrumb-link") && target.dataset.category1) {
          e.preventDefault();
          const category1 = target.dataset.category1;

          productStore.setCategory1(category1);
          productStore.setCategory2("");

          // URL 업데이트
          updateQueryParams({ category1, category2: "" });

          window.history.pushState({}, "", `/?category1=${category1}`);
          router();
          return;
        }

        if (target.classList.contains("breadcrumb-link") && target.dataset.category2) {
          e.preventDefault();
          const category2 = target.dataset.category2;
          const state = productStore.getState();

          productStore.setCategory2(category2);

          updateQueryParams({
            category1: state.category1,
            category2,
          });

          // 홈으로 이동
          window.history.pushState({}, "", `/?category1=${state.category1}&category2=${category2}`);
          router();
          return;
        }

        // 상품 목록으로 돌아가기
        if (target.id === "go-to-product-list") {
          e.preventDefault();
          window.history.pushState({}, "", "/");
          router();
          return;
        }

        // 관련 상품 클릭 이벤트
        if (target.closest(".related-product-card")) {
          e.preventDefault();
          const productCard = target.closest(".related-product-card");
          const productId = productCard.dataset.productId;

          if (productId) {
            window.history.pushState({}, "", `/product/${productId}`);
            router();
          }
        }
      });

      // 장바구니 수량 조절
      const quantityInput = document.getElementById("quantity-input");
      const decreaseBtn = document.getElementById("quantity-decrease");
      const increaseBtn = document.getElementById("quantity-increase");

      if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener("click", () => {
          const currentValue = parseInt(quantityInput.value) || 1;
          if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
          }
        });

        increaseBtn.addEventListener("click", () => {
          const currentValue = parseInt(quantityInput.value) || 1;
          const maxStock = parseInt(quantityInput.max);
          if (currentValue < maxStock) {
            quantityInput.value = currentValue + 1;
          }
        });

        quantityInput.addEventListener("input", () => {
          const value = parseInt(quantityInput.value) || 1;
          const maxStock = parseInt(quantityInput.max);
          if (value < 1) quantityInput.value = 1;
          if (value > maxStock) quantityInput.value = maxStock;
        });
      }

      // 장바구니 추가 이벤트
      const addToCartBtn = document.getElementById("add-to-cart-btn");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", async () => {
          const quantity = parseInt(quantityInput?.value) || 1;

          cartStore.addToCart({}, quantity);

          updateCartCount();
        });
      }
    }

    // 장바구니 스토어 구독
    const cartUnsubscribe = cartStore.subscribe(() => {
      updateCartCount();
    });

    return () => {
      cartUnsubscribe();
    };
  }
  return { template, mount };
}
