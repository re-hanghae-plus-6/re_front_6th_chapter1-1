import { updateURL } from "../utils/url.js";
import { updateCategory } from "../services/productService.js";
import { showSnackbar } from "../widgets/Snackbar.js";
import { ERROR_SNACKBAR } from "../constants/enum.js";
import { setSelectedCategoryStyle } from "../utils/style.js";

export const handleBreadcrumbClick = (e) => {
  const target = e.target;
  const breadcrumbType = target.dataset.breadcrumb;

  if (!breadcrumbType) return;

  switch (breadcrumbType) {
    case "reset": {
      // 전체 카테고리로 리셋
      updateURL({ category1: "", category2: "" });
      updateCategory("", 0); // depth 0은 전체
      break;
    }

    case "category1": {
      // 1depth 카테고리로 이동 (2depth 제거)
      const category1 = target.dataset.category1;
      if (category1) {
        updateURL({ category1: category1, category2: "" });
        updateCategory(category1, 1);
      }
      break;
    }

    default:
      break;
  }
};

export const handleCategoryFilterClick = (e) => {
  const isSecondCategory = e.target.classList.contains("category2-filter-btn");

  // 클릭된 요소가 카테고리 필터 버튼인지 확인
  if (!e.target.classList.contains("category1-filter-btn") && !isSecondCategory) return;

  const category = isSecondCategory ? e.target.dataset.category2 : e.target.dataset.category1;

  if (!category) {
    showSnackbar(ERROR_SNACKBAR);
    return;
  }

  const depth = isSecondCategory ? 2 : 1;

  // URL 파라미터 업데이트
  updateURL({ [`category${depth}`]: category });

  // 카테고리 스타일 업데이트
  setSelectedCategoryStyle(e.target);

  // 상품 업데이트
  updateCategory(category, depth);
};
