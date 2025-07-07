import { ProductDetail } from "../pages/ProductDetail.js";
import { getProduct } from "../api/productApi.js";

export class ProductDetailController {
  constructor(container) {
    this.container = container;
  }

  async render(params = {}) {
    const loadingHTML = ProductDetail({
      isLoading: true,
    });
    this.container.innerHTML = loadingHTML;

    const product = await getProduct(params.id);

    const productDetailHTML = ProductDetail({
      product: {
        ...product,
        price: product.lprice,
      },
      relatedProducts: [],
      isLoading: false,
      category1: product.category1 || "",
      category2: product.category2 || "",
    });

    this.container.innerHTML = productDetailHTML;
  }
}
