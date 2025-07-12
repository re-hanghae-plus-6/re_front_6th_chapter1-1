export function setupItemFilterEvents(handlers) {
  document.addEventListener("change", async (event) => {
    if (event.target.matches("#limit-select")) {
      handlers.handleLimitChange(Number(event.target.value));
    }
    if (event.target.matches("#sort-select")) {
      handlers.handleSortChange(event.target.value);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".category1-filter-btn")) {
      const category1 = event.target.dataset.category1;
      handlers.handleCategory1Filter(category1);
    }

    if (event.target.matches(".category2-filter-btn")) {
      const category2 = event.target.dataset.category2;
      handlers.handleCategory2Filter(category2);
    }

    if (event.target.matches(".category-reset-btn") || event.target.matches(".breadcrumb-reset-btn")) {
      handlers.handleCategoryReset();
    }

    // 브레드크럼 클릭 - category1 클릭 시 해당 카테고리로 이동
    if (event.target.matches(".breadcrumb-category1-btn")) {
      const category1 = event.target.dataset.category1;
      handlers.handleBreadcrumbCategory1Click(category1);
    }
  });
}
