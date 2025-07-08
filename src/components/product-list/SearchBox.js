let searchBoxUnsubscribe = null;

function SearchBox(store) {
  const { state } = store;

  const initHTML = renderUI(state);
  searchBoxUnsubscribe = store.subscribe(updateSearchBoxCategoryUI);

  return initHTML;
}
// 초기 렌더링
function renderUI(state) {
  return /* HTML */ `
    <div id="filter-container" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            id="search-input"
            placeholder="상품명을 검색해보세요..."
            value=""
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <!-- 필터 옵션 -->
      <div class="space-y-3">
        <!-- 카테고리 필터 -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">카테고리:</label>
            <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
          </div>
          <!-- 1depth 카테고리 -->
          <div class="flex flex-wrap gap-2" id="category-container">${renderCategory(state)}</div>
          <!-- 2depth 카테고리 -->
        </div>
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select
              id="limit-select"
              class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10개</option>
              <option value="20" selected="">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
          </div>
          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select
              id="sort-select"
              class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="price_asc" selected="">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="name_asc">이름순</option>
              <option value="name_desc">이름 역순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}
// 카테고리 렌더링
function renderCategory(state) {
  if (state.loading) {
    return /*HTML*/ `
                  <div class="flex flex-wrap gap-2">
                    <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
                  </div>`;
  } else {
    return /*HTML*/ `<button
                      data-category1="생활/건강"
                      class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                         bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      생활/건강
                    </button>
                    <button
                      data-category1="디지털/가전"
                      class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                         bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      디지털/가전
                    </button>
            `;
  }
}
// 카테고리 업데이트
function updateSearchBoxCategoryUI(state) {
  const categoryContainer = document.getElementById("category-container");
  if (categoryContainer) {
    categoryContainer.innerHTML = renderCategory(state);
  }
}
// 구독 해제
export function cleanupSearchBox() {
  if (searchBoxUnsubscribe) {
    searchBoxUnsubscribe();
    searchBoxUnsubscribe = null;
  }
}

// SearchBox 컴포넌트의 이벤트 리스너를 등록하는 함수
export function setupSearchBox() {
  // URL 파라미터에서 초기값 설정
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const limitParam = params.get("limit");
  const sortParam = params.get("sort");

  // limit select 기본값 설정
  if (limitParam) {
    const limitSelect = document.querySelector("#limit-select");
    if (limitSelect) {
      limitSelect.value = limitParam;
    }
  }

  // sort select 기본값 설정
  if (sortParam) {
    const sortSelect = document.querySelector("#sort-select");
    if (sortSelect) {
      sortSelect.value = sortParam;
    }
  }

  // 이벤트 리스너 등록
  const filterContainer = document.getElementById("filter-container");
  if (filterContainer) {
    filterContainer.addEventListener("change", (e) => {
      const { id, value } = e.target;

      if (id === "limit-select") {
        const limit = value;
        const url = new URL(window.location.href);
        url.searchParams.set("limit", limit);
        url.searchParams.set("current", 1);
        window.history.pushState({}, "", url);
        // loadList 함수를 호출하기 위해 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent("loadList"));
      }
      if (id === "sort-select") {
        const sort = value;
        const url = new URL(window.location.href);
        url.searchParams.set("sort", sort);
        window.history.pushState({}, "", url);
        // loadList 함수를 호출하기 위해 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent("loadList"));
      }
    });
    filterContainer.addEventListener("keydown", (e) => {
      const { id, value } = e.target;
      if (id === "search-input") {
        if (e.key === "Enter") {
          const search = value;
          const url = new URL(window.location.href);
          url.searchParams.set("search", search);
          window.history.pushState({}, "", url);
          // loadList 함수를 호출하기 위해 커스텀 이벤트 발생
          window.dispatchEvent(new CustomEvent("loadList"));
        }
      }
    });
  }
}

export default SearchBox;
