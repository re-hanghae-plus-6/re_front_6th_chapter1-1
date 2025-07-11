import * as cartHandlers from "./cartHandlers.js";
import * as productHandlers from "./productHandlers.js";
import * as filterHandlers from "./filterHandlers.js";
import * as productDetailHandlers from "./productDetailHandlers.js";

export default function initializeHandlers(state, render) {
  // 장바구니 관련
  cartHandlers.viewCartHandler(state);
  cartHandlers.closeCartModal();
  cartHandlers.addToCartHandler(state);
  cartHandlers.removeSelectedHandler(state);
  cartHandlers.removeAllHandler(state);
  cartHandlers.handleRemoveSelectedItems(state, render);
  cartHandlers.handleSelectAllCheckbox(state, render);

  // 상품 리스트 관련
  productHandlers.infinityScrollHandler(state, render);

  // 필터 관련
  filterHandlers.handleCategory1Filter(state, render);
  filterHandlers.handleCategory2Filter(state, render);
  filterHandlers.handleSetupBreadcrumb(state, render);
  filterHandlers.handleResetBreadcrumb(state, render);
  filterHandlers.limitHandler(state, render);
  filterHandlers.sortHandler(state, render);

  // 상품 디테일
  productDetailHandlers.setupBreadcrumbCategoryHandlers(state, render);
  productDetailHandlers.setupRelatedProductCardHandler(state, render);
  productDetailHandlers.setupDetailAndCartHandler(state);

  // 검색 입력 엔터 핸들러
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        const value = e.target.value; // 문자열이어야 함
        filterHandlers.handleSearch(value, state, render);
      }
    };
  }
}
