import stateManager from "../state/index.js";

class ProductItem {
  constructor(product) {
    this.product = product;
  }

  /**
   * 상품 이미지 클릭 처리 - 상세 페이지로 이동
   */
  handleImageClick = (e) => {
    const productId = e.currentTarget.dataset.productId;
    // 상세 페이지로 라우팅
    window.history.pushState({}, "", `/product/${productId}`);
    window.dispatchEvent(new Event("popstate"));
  };

  /**
   * 장바구니 담기 버튼 클릭 처리
   */
  handleAddToCart = (e) => {
    e.stopPropagation();
    const productData = this.createProductData();

    // 통합 메서드 사용 (장바구니 추가 + 토스트 표시)
    stateManager.addProductToCart(productData);
  };

  /**
   * 상품 데이터 객체를 생성합니다. (단일 책임)
   */
  createProductData() {
    return {
      id: this.product.productId,
      title: this.product.title,
      name: this.product.title,
      price: parseInt(this.product.lprice),
      image: this.product.image,
      quantity: 1,
    };
  }

  /**
   * 컴포넌트가 DOM에 마운트된 후 호출되는 메서드입니다.
   */
  mounted() {
    const productCard = document.querySelector(`.product-card[data-product-id="${this.product.productId}"]`);
    if (!productCard) return;

    // 이미지 클릭 이벤트
    const productImage = productCard.querySelector(".product-image");
    if (productImage) {
      productImage.addEventListener("click", this.handleImageClick);
      productImage.dataset.productId = this.product.productId;
    }

    // 상품 정보 클릭 이벤트 (제목 영역)
    const productInfo = productCard.querySelector(".product-info");
    if (productInfo) {
      productInfo.addEventListener("click", this.handleImageClick);
      productInfo.dataset.productId = this.product.productId;
    }

    // 장바구니 버튼 클릭 이벤트
    const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", this.handleAddToCart);
    }
  }

  render() {
    const formattedPrice = parseInt(this.product.lprice).toLocaleString();

    return /*html*/ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
           data-product-id="${this.product.productId}">
        <!-- 상품 이미지 -->
        <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
          <img src="${this.product.image}"
               alt="${this.product.title}"
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
               loading="lazy">
        </div>
        <!-- 상품 정보 -->
        <div class="p-3">
          <div class="cursor-pointer product-info mb-3">
            <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              ${this.product.title}
            </h3>
            <p class="text-xs text-gray-500 mb-2">${this.product.brand || ""}</p>
            <p class="text-lg font-bold text-gray-900">
              ${formattedPrice}원
            </p>
          </div>
          <!-- 장바구니 버튼 -->
          <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                  hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${this.product.productId}">
            장바구니 담기
          </button>
        </div>
      </div>
    `;
  }
}

export default ProductItem;
