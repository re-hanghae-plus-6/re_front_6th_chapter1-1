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
import { registerDetailEventListeners } from "../utils/detailEventHandlers.js";

export default function Detail(params = {}) {
  const { productId } = params;

  let cleanupDetailEvents;

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
    if (cleanupDetailEvents) {
      cleanupDetailEvents();
      cleanupDetailEvents = null;
    }

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

            // DOM 업데이트 직후 이벤트 리스너 등록
            cleanupDetailEvents = registerDetailEventListeners({
              productId,
              cartUpdate: updateCartCount,
              navigate: (url) => {
                window.history.pushState({}, "", url);
                router();
              },
            });
          }

          // 관련 상품 로드
          await loadRelatedProducts(product);
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

        // 관련 상품 로드 후 이벤트 리스너 다시 등록
        if (cleanupDetailEvents) {
          cleanupDetailEvents();
        }
        cleanupDetailEvents = registerDetailEventListeners({
          productId,
          cartUpdate: updateCartCount,
          navigate: (url) => {
            window.history.pushState({}, "", url);
            router();
          },
        });
      }
    }

    await loadProduct();

    // 장바구니 스토어 구독
    const cartUnsubscribe = cartStore.subscribe(() => {
      updateCartCount();
    });

    return () => {
      if (cleanupDetailEvents) {
        cleanupDetailEvents();
        cleanupDetailEvents = null;
      }
      cartUnsubscribe();
    };
  }
  return { template, mount };
}
