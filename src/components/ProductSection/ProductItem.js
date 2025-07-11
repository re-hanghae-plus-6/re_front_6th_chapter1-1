import { BASE } from "../../main";
import { navigate } from "../../utils/navigate";
import { cartStore } from "../../states/cart/cartStore";

export const ProductItem = (product) => {
  return /* HTML */ `<div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
    data-product-id="${product.productId}"
  >
    <!-- 상품 이미지 -->
    <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
      <img
        src="${product.image}"
        alt="${product.title}"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        loading="lazy"
      />
    </div>
    <!-- 상품 정보 -->
    <div class="p-3">
      <div class="cursor-pointer product-info mb-3">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title}</h3>
        <p class="text-xs text-gray-500 mb-2">${product.brand}</p>
        <p class="text-lg font-bold text-gray-900">${Number(product.lprice).toLocaleString()}원</p>
      </div>
      <!-- 장바구니 버튼 -->
      <button
        class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn"
        data-product-id="85067212996"
      >
        장바구니 담기
      </button>
    </div>
  </div>`;
};

document.addEventListener("click", (e) => {
  const cartBtn = e.target.closest(".add-to-cart-btn");
  if (cartBtn) {
    const card = cartBtn.closest(".product-card");
    if (!card) return;

    const productId = card.dataset.productId;
    const image = card.querySelector("img")?.src;
    const title = card.querySelector("h3")?.textContent;
    const lprice = card.querySelector(".text-lg.font-bold.text-gray-900")?.textContent;

    const cartItem = {
      productId,
      title,
      image,
      lprice,
      quantity: 1,
    };

    cartStore.addItem(cartItem);
    return;
  }

  const card = e.target.closest(".product-card");
  if (card) {
    const productId = card.dataset.productId;
    navigate(`${BASE}product/${productId}`);
  }
});
