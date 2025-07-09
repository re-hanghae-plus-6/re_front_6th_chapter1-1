import { getCategories } from "../../api/productApi";

let categoryUnsubscribe = null;

async function getCategoryList(store) {
  const response = await getCategories();

  store.setCategories(response);
}

function CategoryFilter(store) {
  const { state } = store;
  const initHTML = renderCategoryFilter(state);
  categoryUnsubscribe = store.subscribe(updateCategoryFilterUI);
  getCategoryList(store);

  return initHTML;
}

// 카테고리 필터 렌더링
function renderCategoryFilter(state) {
  console.log("filter update =>", state);
  return /* HTML */ `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-category1="reset" class="text-xs hover:text-blue-800 hover:underline category-reset-btn">
          전체
        </button>
      </div>
      <!-- 1depth 카테고리 -->
      <div class="flex flex-wrap gap-2" id="category-container">${renderCategoryButtons(state)}</div>
    </div>
  `;
}

// 카테고리 버튼 렌더링
function renderCategoryButtons(state) {
  // 카테고리가 아직 로드되지 않았거나 로딩 중일 때
  if (!state.categories || Object.keys(state.categories).length === 0) {
    return /*HTML*/ `
      <div class="flex flex-wrap gap-2">
        <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
      </div>`;
  }

  return /*HTML*/ `
    ${Object.keys(state.categories)
      .map((category) => {
        return /*HTML*/ `
        <button
          data-category1="${category}"
          class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
             bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ${category}
        </button>
      `;
      })
      .join("")}
  `;
}

// 카테고리 UI 업데이트
function updateCategoryFilterUI(state) {
  const categoryContainer = document.getElementById("category-container");
  if (categoryContainer) {
    categoryContainer.innerHTML = renderCategoryButtons(state);
  }
}

// 카테고리 클릭 핸들러
function handleCategory1DepthClick(category1) {
  if (category1 === "reset") {
    // 전체 카테고리 선택 시 파라미터 제거
    const url = new URL(window.location.href);
    url.searchParams.delete("category1");
    window.history.pushState({}, "", url);
  } else {
    // 특정 카테고리 선택
    const url = new URL(window.location.href);
    url.searchParams.set("category1", category1);
    window.history.pushState({}, "", url);
    window.dispatchEvent(new CustomEvent("loadList"));
  }
}

// 카테고리 필터 이벤트 리스너 설정
export function setupCategoryFilter() {
  const filterContainer = document.getElementById("filter-container");
  if (filterContainer) {
    // 카테고리 클릭 이벤트 (이벤트 위임)
    filterContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("category1-filter-btn") || e.target.classList.contains("category-reset-btn")) {
        const { category1 } = e.target.dataset;
        handleCategory1DepthClick(category1);
      }
    });
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
