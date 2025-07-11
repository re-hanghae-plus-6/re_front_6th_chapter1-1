import { getProduct, getProducts } from "../../api/productApi";

export class DetailPageController {
  private state = {
    product: null,
    relatedProducts: [],
    loading: false,
  };

  async loadProductData(productId, updateUI) {
    this.state.loading = true;
    updateUI({ ...this.state });

    try {
      // 상품 상세 정보 로드
      const product = await getProduct(productId);
      this.state.product = product;

      // 관련 상품 로드 (같은 카테고리의 다른 상품들)
      if (product && product.category2) {
        const relatedData = await getProducts({
          limit: 10,
          category2: product.category2,
        });

        // 현재 상품 제외
        this.state.relatedProducts = relatedData.products.filter((item) => item.productId !== productId).slice(0, 20);
      }

      this.state.loading = false;
      updateUI({ ...this.state });
    } catch (error) {
      console.error("Failed to load product data:", error);
      this.state.loading = false;
      this.state.product = null;
      this.state.relatedProducts = [];
      updateUI({ ...this.state });
    }
  }

  getState() {
    return { ...this.state };
  }
}
