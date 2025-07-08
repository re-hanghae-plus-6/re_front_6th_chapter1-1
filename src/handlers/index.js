import * as cartHandlers from "./cartHandlers.js";
import * as productHandlers from "./productHandlers.js";
import * as filterHandlers from "./filterHandlers.js";

export default function initializeHandlers(state, render) {
  // 장바구니 관련
  cartHandlers.viewCartHandler(state);
  cartHandlers.closeCartModal();
  cartHandlers.addToCartHandler(state);
  cartHandlers.setupCartItemRemoveHandler(state, render);
  cartHandlers.setupCartCheckboxHandlers(state, render);
  cartHandlers.setupRemoveSelectedHandler(state, render);
  cartHandlers.setupClearCartHandler(state, render);

  // 상품 리스트 관련
  productHandlers.setupScrollInfinityHandler(state, render);

  // 필터 관련
  filterHandlers.handleCategory1Filter(state, render);
  filterHandlers.handleCategory2Filter(state, render);
  filterHandlers.handleSetupBreadcrumb(state, render);
  filterHandlers.handleResetBreadcrumb(state, render);
  filterHandlers.limitHandler(state, render);
  filterHandlers.sortHandler(state, render);

  // 검색 입력 엔터 핸들러
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = e.target.value; // 문자열이어야 함
        filterHandlers.handleSearch(value, state, render);
      }
    });
  }
}
