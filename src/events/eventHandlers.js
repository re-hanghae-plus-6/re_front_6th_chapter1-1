import { loadProductsAndUpdateUI } from "../main.js";
import { addCart, updateHeaderCartCount } from "../utils/cart.js";
import { showToast } from "../template/toast.js";

export function setupCommonEventListeners(mainStatus, appRouter) {
  /** change */
  let shouldUpdate = false;
  document.body.addEventListener("change", (e) => {
    const target = e.target;

    if (target.id === "limit-select") {
      mainStatus.params.limit = parseInt(target.value, 10);
      shouldUpdate = true;
    } else if (target.id === "sort-select") {
      mainStatus.params.sort = target.value;
      mainStatus.params.limit = 20;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      mainStatus.params.page = 1; // 필터 변경 시 첫 페이지로 초기화
      loadProductsAndUpdateUI(mainStatus, appRouter); // mainStatus와 appRouter 전달
    }
  });

  document.body.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "search-input") {
      mainStatus.params.search = e.target.value;
      shouldUpdate = true;
    } else {
      return;
    }
    if (shouldUpdate) {
      mainStatus.params.page = 1; // 필터 변경 시 첫 페이지로 초기화
      loadProductsAndUpdateUI(mainStatus, appRouter); // mainStatus와 appRouter 전달
    }
  });
  // 상품 카드 클릭 이벤트 (이벤트 위임)
  document.body.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card"); // 상품 카드
    const addToCartBtn = e.target.closest("#add-to-cart-btn"); // 장바구니 담기
    const increaseQuantyBtn = e.target.closest("#quantity-increase"); // 상품 수량 증가
    const decreaseQuantyBtn = e.target.closest("#quantity-decrease"); // 상품 수량 감소
    const breadcrumb = e.target.closest(".breadcrumb-link"); // 브레드크럼 (카테고리)

    // 상품 카드가 클릭되었고, 장바구니 버튼이 아닌 경우에만 상세 페이지로 이동
    if (productCard && !addToCartBtn) {
      const productId = productCard.dataset.productId; // data-product-id 속성에서 productId를

      if (productId) {
        appRouter.navigate(`/product/${productId}`); // 라우터로 페이지 이동
      }
      return; // 다른 버튼들과의 중복 실행 방지
    }

    // --- 상세 페이지 버튼 처리 ---
    const quantityInput = document.body.querySelector("#quantity-input");

    // 수량 증가
    if (increaseQuantyBtn && quantityInput) {
      quantityInput.value = parseInt(quantityInput.value, 10) + 1;
      return;
    }

    // 수량 감소
    if (decreaseQuantyBtn && quantityInput) {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
      return;
    }

    // 장바구니 담기
    if (addToCartBtn) {
      if (!quantityInput) return; // quantityInput이 없으면 로직 중단

      const quantity = parseInt(quantityInput.value, 10);
      const productId = addToCartBtn.dataset.productId;
      const product = mainStatus.products.find((p) => p.productId === productId);

      if (product) {
        addCart(product, quantity); // 수량을 함께 전달
        showToast("장바구니에 추가되었습니다");
        updateHeaderCartCount();
      }
      return;
    }
    
  });
  // TODO: 그 외 다른 이벤트 설정.....
}
