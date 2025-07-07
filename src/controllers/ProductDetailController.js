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

    const product = await productService.getProduct(productId);
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
