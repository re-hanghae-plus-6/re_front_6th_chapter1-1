import { navigateTo } from "../router/router";

/** 브레드크럼 선택시 카테고리별 상품 목록 이동 */
export function setupBreadcrumbCategoryHandlers() {
  document.querySelectorAll(".breadcrumb-link").forEach((btn) => {
    btn.addEventListener("click", () => {
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
    });
  });
}

/** 해당 상품페이지 이동 */
export function setupRelatedProductCardHandler() {
  const relatedList = document.getElementById("related-products-list");
  if (relatedList) {
    relatedList.addEventListener("click", function (e) {
      const card = e.target.closest(".related-product-card");
      if (card && card.dataset.productId) {
        navigateTo(`/product/${card.dataset.productId}`);
      }
    });
  }
}
