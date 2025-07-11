import { DetailLoadingIndicator } from "../components/detail/loading/detailLoadingIndicator.js";
import { ProductDetail } from "../components/detail/product/productDetail.js";
import { DetailBreadCrumb } from "../components/detail/layout/detailBreadCrumb.js";
import { Header } from "../components/productList/layout/header.js";
import { RelatedProducts } from "../components/detail/product/relatedProducts.js";
import { Footer } from "../components/productList/layout/footer.js";
import { store } from "../store.js";
import { getProduct, getProducts } from "../api/productApi.js";
import { render } from "../render.js";
import { SuccessToast } from "../components/toast/successToast.js";
import { router } from "../router.js";
import { addToCart } from "../entity/cart.js";
import { openToast } from "../utils/toast.js";

const state = {
  product: null,
  isDetailLoading: false,
  isRelatedProductsLoading: false,
  isCartAdded: false,
  relatedProducts: [],
  cartItems: [],
};

export const ProductDetailPage = () => {
  const [mounted, setMounted] = store.useState("mounted");

  const detailPathArray = new URL(window.location.href).pathname.split("/");
  const productId = detailPathArray[detailPathArray.length - 1];

  if (mounted === false) {
    state.isDetailLoading = true;

    getProduct(productId).then(async (product) => {
      state.product = product;
      state.isDetailLoading = false;
      setMounted(true);
      render();
    });
  }

  state.isRelatedProductsLoading = true;
  if (state.product && state.relatedProducts.length <= 0) {
    new Promise((r) => setTimeout(r, 2_000)).then(() => {
      getProducts({
        category1: state.product.category1,
        category2: state.product.category2,
      }).then((x) => {
        state.relatedProducts = x.products.filter((product) => product.productId !== state.product.productId);
        state.isRelatedProductsLoading = false;
        render();
      });
    });
  }

  return `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title: "상품 상세", cartItemCount: store.getState("cartItems").length })}
    <main class="max-w-md mx-auto px-4 py-4">
      ${
        state.isDetailLoading
          ? DetailLoadingIndicator
          : `
          <!-- 브레드크럼 -->
          ${DetailBreadCrumb({
            category1: state.product.category1,
            category2: state.product.category2,
          })}
            <!-- 상품 상세 정보 -->
            ${ProductDetail({
              image: state.product.image,
              name: state.product.title,
              rating: state.product.rating,
              reviewCount: state.product.reviewCount,
              price: state.product.lprice,
              stock: state.product.stock,
              description: state.product.description,
            })}`
      }
      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
          hover:bg-gray-200 transition-colors go-to-product-list">
          상품 목록으로 돌아가기
        </button>
      </div>
      <!-- 관련 상품 -->
      ${
        state.isRelatedProductsLoading && (state.relatedProducts ?? []).length <= 0
          ? ""
          : RelatedProducts({
              products: state.relatedProducts,
            })
      }
    </main>
    ${Footer}
  </div>
  ${SuccessToast({ message: "장바구니에 추가되었습니다" })}
  `;
};

ProductDetailPage.registerEvent = () => {
  const quantityDecreaseButton = document.querySelector("#quantity-decrease");
  const quantityIncreaseButton = document.querySelector("#quantity-increase");
  const quantityInput = document.querySelector("#quantity-input");
  const addToCartButton = document.querySelector("#add-to-cart-btn");
  const relatedProductCards = document.querySelectorAll("#related-product");

  if (quantityDecreaseButton) {
    quantityDecreaseButton.addEventListener("click", () => {
      const quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
      }
    });
  }

  if (quantityIncreaseButton) {
    quantityIncreaseButton.addEventListener("click", () => {
      const quantity = parseInt(quantityInput.value);
      if (quantity < state.product.stock) {
        quantityInput.value = quantity + 1;
      }
    });
  }

  if (addToCartButton) {
    addToCartButton.addEventListener("click", async () => {
      const quantity = parseInt(quantityInput.value);

      addToCart(state.product, quantity);

      openToast({ message: "장바구니에 추가되었습니다", type: "success" });
    });
  }

  if (relatedProductCards) {
    relatedProductCards.forEach((relatedProductCard) => {
      relatedProductCard.addEventListener("click", () => {
        const productId = relatedProductCard.dataset.productId;
        router.push(`/product/${productId}`);
        state.relatedProducts = [];
        store.setState("mounted", false);
      });
    });
  }
};
