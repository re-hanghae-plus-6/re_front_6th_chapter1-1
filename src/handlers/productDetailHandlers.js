import cart from "../@store/cart";
import { navigateTo } from "../router/router";
import { showAddToCartToast, updateCartCount } from "./cartHandlers";

/** 브레드크럼 선택시 카테고리별 상품 목록 이동 */
export function setupBreadcrumbCategoryHandlers() {
  document.querySelectorAll(".breadcrumb-link").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.category2) {
        const category1 = btn.dataset.category1 || "";
        navigateTo(
          `/?category1=${encodeURIComponent(category1)}&category2=${encodeURIComponent(btn.dataset.category2)}`,
        );
        return;
      }
      if (btn.dataset.category1) {
        navigateTo(`/?category1=${encodeURIComponent(btn.dataset.category1)}`);
      }
    };
  });
}

/** 해당 상품페이지 이동 */
export function setupRelatedProductCardHandler() {
  const relatedList = document.getElementById("related-products-list");
  if (relatedList) {
    relatedList.onclick = (e) => {
      const card = e.target.closest(".related-product-card");
      if (card && card.dataset.productId) {
        navigateTo(`/product/${card.dataset.productId}`);
      }
    };
  }
}

// 상세 페이지 수량 증감 및 장바구니 담기 통합 핸들러
export function setupDetailAndCartHandler(state) {
  const increaseBtn = document.getElementById("quantity-increase");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const input = document.getElementById("quantity-input");
  const btn = document.getElementById("add-to-cart-btn");

  if (!decreaseBtn || !increaseBtn || !input || !btn || !state.product) return;

  // 수량 증가
  increaseBtn.onclick = () => {
    let value = parseInt(input.value);
    if (!isNaN(value)) {
      const changevalue = value + 1;
      input.value = changevalue;
    }
  };

  // 수량 감소
  decreaseBtn.onclick = () => {
    let value = parseInt(input.value);
    if (!isNaN(value) && value > 1) {
      const changevalue = value - 1;
      input.value = changevalue;
    }
  };

  // 장바구니 담기
  btn.onclick = () => {
    const quantity = parseInt(input.value) || 1;
    const productId = state.product.productId;
    const exists = cart.state.find((item) => item.productId === productId);

    if (exists) {
      cart.setState(
        cart.state.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      );
    } else {
      cart.setState([...cart.state, { ...state.product, quantity }]);
    }

    localStorage.setItem("cart", JSON.stringify(cart.state));
    updateCartCount(cart.state);
    showAddToCartToast();
  };
}
