import { getURLParams } from "../utils/url.js";
import { setSelectedCategoryStyle } from "../utils/style.js";

export const syncFormWithURL = () => {
  const params = getURLParams();

  // limit select 값 설정
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.value = params.limit;
  }

  // sort select 값 설정
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.value = params.sort;
  }

  // search input 값 설정
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = params.search;
  }

  // 카테고리 필터링 버튼 값 설정
  const categoryButtons = document.querySelectorAll(".category1-filter-btn");
  categoryButtons.forEach((button) => {
    const category = button.dataset.category1;
    if (category === params.category1) {
      setSelectedCategoryStyle(button);
    }
  });
};
