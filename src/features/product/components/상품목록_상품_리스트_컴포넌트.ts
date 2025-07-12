import { Component } from "../../../../componet";

import { productStore } from "../model/product-store";
import { cartStore } from "../../cart/model/cartStore";
import { EventDelegator } from "../../../../event-delegator";
import { getCartAction } from "../../cart/controller/get-cart-action";
import { BASE_PATH } from "../../../router/create-router";

export class 상품목록_상품_리스트_컴포넌트 extends Component {
  subscribeStoreList: Array<() => void> = [];
  render(): HTMLElement {
    const productList = productStore.value.data;

    const products = productList.flatMap((v) => v.products);

    const el = document.createElement("div");

    if (productStore.value.isLoading && !products.length) {
      return el;
    }

    el.innerHTML = /* HTML */ `
      <div>
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${productStore.value.data[0]?.pagination?.total}개</span>의 상품
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${products
            .map(
              (product) =>
                /* HTML */
                `<div
                  class="block bg-white p-2 cursor-pointer rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
                  data-product-id="${product.productId}"
                  style="text-decoration: none; color: inherit;"
                  event-id="product-card"
                >
                  <!-- 상품 이미지 -->
                  <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
                    <img
                      src=${product.image}
                      alt="${product.title}"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <!-- 상품 정보 -->
                  <div class="p-3">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title}</h3>
                    <p class="text-xs text-gray-500 mb-2">${product.brand ? product.brand : product.mallName}</p>
                    <p class="text-lg font-bold text-gray-900">
                      ${product.lprice
                        ? `${Number(product.lprice).toLocaleString()}원`
                        : `${Number(product.hprice).toLocaleString()}원`}
                    </p>
                  </div>
                  <!-- 장바구니 버튼 -->
                  <button
                    event-id="add-to-cart"
                    class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                       hover:bg-blue-700 transition-colors add-to-cart-btn"
                    data-product-id="${product.productId}"
                    type="button"
                  >
                    장바구니 담기
                  </button>
                </div>`,
            )
            .join("")}
        </div>
      </div>
    `;
    return el;
  }

  componentDidMount() {
    this.subscribeStoreList.push(
      productStore.subscribe(() => {
        this.update();
      }),
    );
    EventDelegator.getInstance().register("click", "add-to-cart", (e) => {
      const target = (e.target as HTMLElement).closest(".add-to-cart-btn");
      if (!target) return;

      const productId = target.getAttribute("data-product-id");
      if (!productId) return;
      getCartAction().addToCart(productId);
    });

    EventDelegator.getInstance().register("click", "product-card", (e) => {
      const target = e.target as HTMLElement;
      const productId = target.closest(".product-card")?.getAttribute("data-product-id");
      if (!productId) return;

      history.pushState({}, "", `${BASE_PATH}/product/${productId}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  }

  componentWillUnmount() {
    EventDelegator.getInstance().unregister("click", "add-to-cart");
    this.subscribeStoreList.forEach((unsubscribe) => unsubscribe());
  }
}
