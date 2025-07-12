import StateManager from "./StateManager.js";
import { getProduct } from "../api/productApi.js";

const defaultProduct = {
  productId: "",
  title: "",
  price: 0,
  image: "",
  description: "",
  rating: 0,
  reviewCount: 0,
  stock: 0,
  images: [],
  category1: "",
  category2: "",
  brand: "",
};

class ProductDetailManager extends StateManager {
  constructor() {
    super();
    this.state = {
      product: defaultProduct,
      loading: false,
      error: null,
      categories: [],
      relatedProducts: [],
      relatedProductsLoading: false,
      relatedProductsError: null,
    };
  }

  /**
   * 상품 설정
   * @param {Object} product - 상품 객체
   */
  setProduct(product) {
    // 카테고리 정보 추출 및 설정
    const categories = this.extractCategories(product);
    this.setState({
      product,
      categories,
    });
  }

  /**
   * 상품에서 카테고리 정보 추출
   * @param {Object} product - 상품 객체
   * @returns {Array} 카테고리 정보 배열
   */
  extractCategories(product) {
    const categories = [];
    if (product.category1) {
      categories.push({
        name: product.category,
        type: "category1",
      });
    }
    if (product.category2) {
      categories.push({
        name: product.subcategory,
        type: "category2",
        parent: product.category,
      });
    }
    return categories;
  }

  /**
   * 로딩 상태 설정
   * @param {boolean} loading - 로딩 상태
   */
  setLoading(loading) {
    this.setState({ loading });
  }

  /**
   * 에러 상태 설정
   * @param {string|null} error - 에러 메시지
   */
  setError(error) {
    this.setState({ error });
  }

  /**
   * 상품 정보 로드
   * @param {string} productId - 상품 ID
   */
  async loadProduct(productId) {
    this.setLoading(true);
    try {
      const product = await getProduct(productId);
      this.setProduct(product);
      this.setError(null);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * 상태 초기화
   */
  reset() {
    this.state = {
      product: defaultProduct,
      loading: false,
      error: null,
      categories: [],
      relatedProducts: [],
      relatedProductsLoading: false,
      relatedProductsError: null,
    };
  }
}

export default ProductDetailManager;
