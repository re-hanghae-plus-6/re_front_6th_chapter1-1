import { getProduct, getProducts } from "../api/index.js";

/**
 * 상품 상세 서비스 클래스
 */
class ProductDetailService {
  constructor() {
    this.state = {
      product: null,
      relatedProducts: [],
      loading: false,
      error: null,
      quantity: 1,
    };
    this.listeners = [];
  }

  /**
   * 상태 변경 리스너 추가
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * 상태 변경 리스너 제거
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * 모든 리스너에게 상태 변경 알림
   */
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * 현재 상태 반환
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 상품 상세 정보 로드
   */
  async loadProduct(productId) {
    if (!productId) {
      this.state.error = "상품 ID가 필요합니다.";
      this.notifyListeners();
      return;
    }

    this.state.loading = true;
    this.state.error = null;
    this.state.relatedProducts = []; // 관련 상품 초기화
    this.notifyListeners();

    try {
      // 상품 상세 정보 로드
      const product = await getProduct(productId);

      if (!product) {
        this.state.error = "상품을 찾을 수 없습니다.";
        this.state.loading = false;
        this.notifyListeners();
        return;
      }

      this.state.product = product;
      this.state.loading = false;

      // 상품 정보만 먼저 렌더링
      this.notifyListeners();

      // 관련 상품은 별도로 비동기 로드
      this.loadRelatedProductsAsync(product);
    } catch (error) {
      console.error("상품 상세 정보 로드 실패:", error);
      this.state.error = "상품 정보를 불러오는데 실패했습니다.";
      this.state.loading = false;
      this.notifyListeners();
    }
  }

  /**
   * 관련 상품 로드 (동기)
   */
  async loadRelatedProducts(product) {
    try {
      // 같은 category2의 다른 상품들을 가져옴
      const response = await getProducts({
        category1: product.category1,
        category2: product.category2,
        limit: 20, // 관련 상품 최대 20개
      });

      // 현재 상품을 제외한 관련 상품들
      this.state.relatedProducts = response.products.filter((p) => p.productId !== product.productId);
    } catch (error) {
      console.error("관련 상품 로드 실패:", error);
      this.state.relatedProducts = [];
    }
  }

  /**
   * 관련 상품 비동기 로드
   */
  async loadRelatedProductsAsync(product) {
    try {
      // 같은 category2의 다른 상품들을 가져옴
      const response = await getProducts({
        category1: product.category1,
        category2: product.category2,
        limit: 20, // 관련 상품 최대 20개
      });

      // 현재 상품을 제외한 관련 상품들
      this.state.relatedProducts = response.products.filter((p) => p.productId !== product.productId);

      // 관련 상품 로드 완료 후 렌더링 업데이트
      this.notifyListeners();
    } catch (error) {
      console.error("관련 상품 로드 실패:", error);
      this.state.relatedProducts = [];
      this.notifyListeners();
    }
  }

  /**
   * 수량 변경
   */
  changeQuantity(quantity) {
    const newQuantity = Math.max(1, Math.min(quantity, this.state.product?.stock || 107));
    this.state.quantity = newQuantity;
    this.notifyListeners();
    return newQuantity;
  }

  /**
   * 수량 증가
   */
  increaseQuantity() {
    return this.changeQuantity(this.state.quantity + 1);
  }

  /**
   * 수량 감소
   */
  decreaseQuantity() {
    return this.changeQuantity(this.state.quantity - 1);
  }

  /**
   * 장바구니에 추가
   */
  addToCart() {
    if (!this.state.product) {
      return false;
    }

    try {
      // 기존 장바구니 데이터 가져오기
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");

      // 이미 장바구니에 있는 상품인지 확인
      const existingItemIndex = cartData.findIndex((item) => item.productId === this.state.product.productId);

      if (existingItemIndex >= 0) {
        // 기존 상품의 수량 증가
        cartData[existingItemIndex].quantity += this.state.quantity;
      } else {
        // 새 상품 추가
        cartData.push({
          ...this.state.product,
          quantity: this.state.quantity,
          selected: true,
        });
      }

      // 장바구니 데이터 저장
      localStorage.setItem("cart", JSON.stringify(cartData));

      // 수량을 1로 리셋
      this.state.quantity = 1;
      this.notifyListeners();

      return true;
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      return false;
    }
  }

  /**
   * 상태 초기화
   */
  reset() {
    this.state = {
      product: null,
      relatedProducts: [],
      loading: false,
      error: null,
      quantity: 1,
    };
    this.notifyListeners();
  }
}

export const productDetailService = new ProductDetailService();
