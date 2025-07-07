import * as productApi from "../api/productApi.js";

class ProductService {
  // 상품 목록 조회
  async getProducts(params = {}) {
    return await productApi.getProducts(params);
  }

  // 단일 상품 조회
  async getProduct(productId) {
    return await productApi.getProduct(productId);
  }

  // 카테고리 목록 조회
  async getCategories() {
    return await productApi.getCategories();
  }
}

// 애플리케이션 전역에서 공유되는 싱글톤 인스턴스
const productService = new ProductService();
export default productService;
