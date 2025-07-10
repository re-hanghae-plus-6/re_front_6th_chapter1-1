import { render } from "../main";
import Header from "./Header";

ProductCard.mount = () => {
  const items = document.querySelectorAll(".product-card");
  items.forEach((item) => {
    const productId = item.getAttribute("data-product-id");
    item.querySelector("img").addEventListener("click", async () => {
      window.history.pushState({}, "", `/product/${productId}`);
      Header.init();
      render.draw("header", Header());
      await render.view();
    });

    item.querySelector(".add-to-cart-btn").addEventListener("click", () => {
      console.log("장바구니 추가");
    });
  });
};

export default function ProductCard(product) {
  return /* html */ `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
    data-product-id="${product.productId}">
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img src="${product.image}"
            alt="${product.title}"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            loading="lazy">
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            ${product.title}
          </h3>
          <p class="text-xs text-gray-500 mb-2"></p>
          <p class="text-lg font-bold text-gray-900">
            ${product.lprice}원
          </p>
        </div>
        <!-- 장바구니 버튼 -->
        <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
              hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="${product.productId}">
          장바구니 담기
        </button>
      </div>
    </div>
  `;
}
