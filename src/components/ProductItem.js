class ProductItem {
  constructor(product) {
    this.product = product;
  }

  // {
  //   "title": "방충망 미세먼지 롤 창문 모기장 DIY 100cmx10cm",
  //   "link": "https:\/\/smartstore.naver.com\/main\/products\/668979777",
  //   "image": "https:\/\/shopping-phinf.pstatic.net\/main_1112415\/11124150101.10.jpg",
  //   "lprice": "450",
  //   "hprice": "",
  //   "mallName": "동백물산",
  //   "productId": "11124150101",
  //   "productType": "2",
  //   "brand": "메쉬코리아",
  //   "maker": "",
  //   "category1": "생활\/건강",
  //   "category2": "생활용품",
  //   "category3": "생활잡화",
  //   "category4": "모기장"
  // }

  render() {
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
            <p class="text-xs text-gray-500 mb-2">${this.product.brand}</p>
            <p class="text-lg font-bold text-gray-900">
              ${this.product.lprice}
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
