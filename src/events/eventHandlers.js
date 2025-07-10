import { loadProductsAndUpdateUI } from "../main.js"; // main.js에서 필요한 함수 임포트

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
    const productCard = e.target.closest(".product-card"); // 클릭된 요소의 가장 가까운

    const addToCartBtn = e.target.closest(".add-to-cart-btn"); // 클릭된 요소가 장바구니 버튼인지

    // 상품 카드가 클릭되었고, 장바구니 버튼이 아닌 경우에만 상세 페이지로 이동
    if (productCard && !addToCartBtn) {
      const productId = productCard.dataset.productId; // data-product-id 속성에서 productId를

      if (productId) {
        appRouter.navigate(`/product/${productId}`); // 라우터로 페이지 이동
      }
    }
  });

  // TODO: 그 외 다른 이벤트 설정.....
}