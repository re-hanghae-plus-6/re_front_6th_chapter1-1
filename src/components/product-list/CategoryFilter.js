// import { getCategories } from "../../api/productApi";
import { getQueryParam } from "../../utils/getQueryParam";
import { store } from "../../store/store.js";
import BreadCrumbs from "./BreadCrumbs.js";
let categoryUnsubscribe = null;

function CategoryFilter() {
  // Home.js에서 이미 카테고리를 로딩하므로 여기서는 호출하지 않음
  // getCategoryList(); // 이 줄 제거

  const render = () => {
    return /* HTML */ `
      <div class="space-y-2">
        ${BreadCrumbs().render()}
        <div class="flex flex-wrap gap-2" data-category-container>${renderCategoryButtons()}</div>
      </div>
    `;
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (e) => {
    // 특정 카테고리 선택
    const { category1, category2 } = e.dataset;
    const url = new URL(window.location.href);

    if (category2) {
      // category1은 유지하고 category2만 설정
      url.searchParams.set("category1", category1);
      url.searchParams.set("category2", category2);
      window.history.pushState({}, "", url);
    }
    // 1뎁스 클릭인 경우 (category2가 없고 category1만 있음)
    else if (category1) {
      // category1만 설정하고 category2는 제거
      url.searchParams.set("category1", category1);
      url.searchParams.delete("category2");
      window.history.pushState({}, "", url);
    }

    updateUI();
    window.dispatchEvent(new CustomEvent("loadList"));
  };

  const reset = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("category1");
    url.searchParams.delete("category2");
    window.history.pushState({}, "", url);
    updateUI();

    window.dispatchEvent(new CustomEvent("loadList"));
  };

  // 카테고리 필터 이벤트 리스너 설정
  const updateUI = () => {
    const categoryContainer = document.querySelector("[data-category-container]");
    if (categoryContainer) {
      categoryContainer.innerHTML = renderCategoryButtons();
    }

    // 브래드크럼 업데이트
    BreadCrumbs().update();
  };

  const setup = () => {
    const filterContainer = document.getElementById("filter-container");
    if (filterContainer) {
      // 카테고리 클릭 이벤트 (이벤트 위임)
      filterContainer.addEventListener("click", (e) => {
        const { category1, breadcrumb } = e.target.dataset;
        if (e.target.classList.contains("category1-filter-btn")) {
          handleCategoryClick(e.target);
        } else if (breadcrumb === "reset") {
          reset();
        } else if (breadcrumb === "category1") {
          const url = new URL(window.location.href);
          url.searchParams.set("category1", category1);
          url.searchParams.delete("category2");
          window.history.pushState({}, "", url);
          updateUI();
        }
      });
    }
  };

  categoryUnsubscribe = store.subscribe(() => {
    updateUI();
  });

  return { render, setup, update: updateUI, reset };
}

// 카테고리 버튼 렌더링
function renderCategoryButtons() {
  // 카테고리가 아직 로드되지 않았거나 로딩 중일 때
  const { categories } = store.state;
  const category1 = getQueryParam("category1");

  if (!categories || Object.keys(categories).length === 0) {
    return /*HTML*/ `
      <div class="flex flex-wrap gap-2">
        <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
      </div>`;
  }

  if (!category1) {
    const firstDepthCategories = Object.keys(categories);
    return /*HTML*/ `
      ${firstDepthCategories
        .map((category) => {
          return /*HTML*/ `
            <button data-category1="${category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${category}</button>
          `;
        })
        .join("")}
    `;
  } else {
    const secondDepthCategories = categories[category1] ? Object.keys(categories[category1]) : [];
    return /*HTML*/ `
      ${secondDepthCategories
        .map((category) => {
          return /*HTML*/ `
            <button data-category1="${category1}" data-category2="${category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${category}</button>
          `;
        })
        .join("")}
    `;
  }
}

// 구독 해제
export function cleanupCategoryFilter() {
  if (categoryUnsubscribe) {
    categoryUnsubscribe();
    categoryUnsubscribe = null;
  }
}

export default CategoryFilter;
