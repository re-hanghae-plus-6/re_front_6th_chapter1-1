import ProductDetailPage from "../pages/ProductDetailPage.js";
import productService from "../services/ProductService.js";
import router from "../router/Router.js";
import { addToCart, updateCartBadge } from "../features/cart/index.js";

class ProductDetailController {
  constructor(rootSelector = "#root") {
    this.rootEl = document.querySelector(rootSelector);
  }

  async show(productId) {
    this.rootEl.innerHTML = ProductDetailPage({ loading: true });

    // 1) 상품 기본 정보 로드
    const product = await productService.getProduct(productId);

    // 2) 우선 상품 정보만 렌더링 (관련 상품 제외)
    this.rootEl.innerHTML = ProductDetailPage({ loading: false, product, related: [] });
    this.attachEvents(product);
    updateCartBadge();

    // 3) 관련 상품 비동기 로드 → 준비되면 다시 렌더링
    const { products: all } = await productService.getProducts({ limit: 100 });
    const related = all.filter((p) => p.productId !== productId).slice(0, 19);

    this.rootEl.innerHTML = ProductDetailPage({ loading: false, product, related });
    this.attachEvents(product);
    updateCartBadge();
  }

  attachEvents(product) {
    const qtyInput = document.querySelector("#quantity-input");
    document.querySelector("#quantity-increase").onclick = () => (qtyInput.value = Number(qtyInput.value) + 1);
    document.querySelector("#quantity-decrease").onclick = () => {
      if (qtyInput.value > 1) qtyInput.value = Number(qtyInput.value) - 1;
    };

    document.querySelector("#add-to-cart-btn").onclick = () => {
      const qty = Number(qtyInput.value);
      addToCart(product, qty);
    };

    document.querySelectorAll(".related-product-card").forEach((card) => {
      card.onclick = () => router.navigate(`/product/${card.dataset.productId}`);
    });

    document.querySelector(".go-to-product-list")?.addEventListener("click", () => {
      router.navigate("/");
    });
  }
}

const productDetailController = new ProductDetailController();
export default productDetailController;
