import { store } from "../main";
import Breadcrumb from "./Breadcrumb";
import Loading from "./Loading";

Search.mount = () => {
  const params = new URLSearchParams(window.location.search);
  const paramObj = {};
  for (const [key, value] of params.entries()) {
    paramObj[key] = value;
  }

  const limitSelect = document.querySelector("#limit-select");
  const sortSelect = document.querySelector("#sort-select");
  const searchInput = document.querySelector("#search-input");
  const limit = paramObj.limit || store.get("params")["limit"];
  const sort = paramObj.sort || store.get("params")["sort"];
  const search = paramObj.search || store.get("params")["search"];

  limitSelect.value = limit;
  sortSelect.value = sort;
  searchInput.value = search;

  const handleKeyup = (event) => {
    if (event.key !== "Enter") return;
    store.set("params", {
      ...store.get("params"),
      search: event.target.value,
      page: 1,
    });
  };

  window.addEventListener("keypress", handleKeyup);

  document.querySelector("#limit-select").addEventListener("change", (event) => {
    store.set("params", {
      ...store.get("params"),
      limit: event.target.value,
      page: 1,
    });
  });

  document.querySelector("#sort-select").addEventListener("change", (event) => {
    store.set("params", {
      ...store.get("params"),
      sort: event.target.value,
      page: 1,
    });
  });

  // 1depth 카테고리 버튼 이벤트 바인딩
  const category1Buttons = document.querySelectorAll(".category1-filter-btn");
  const categoryDefaultStyle = "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors";

  category1Buttons.forEach((category1) => {
    category1.addEventListener("click", () => {
      store.set("params.category1", category1.getAttribute("data-category1"));
      // params가 바뀌면 Home.js의 watch에서 Search, Breadcrumb 모두 다시 렌더+mount됨
    });
  });

  // 2depth 카테고리 버튼 이벤트 바인딩 (렌더 후 mount에서만 바인딩!)
  const category2Buttons = document.querySelectorAll(".category2-filter-btn");
  category2Buttons.forEach((category2) => {
    category2.addEventListener("click", (event) => {
      // 모든 버튼 스타일 초기화
      category2Buttons.forEach((btn) => {
        btn.classList = categoryDefaultStyle + " bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
      });
      // 클릭된 버튼만 파란색
      event.target.classList = categoryDefaultStyle + " bg-blue-100 border-blue-300 text-blue-800";
      store.set("params.category2", category2.getAttribute("data-category2"));
      // params가 바뀌면 Home.js의 watch에서 Search, Breadcrumb 모두 다시 렌더+mount됨
    });
  });
};

export default function Search(categories = {}, isLoading = true) {
  return /* html */ `
    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <!-- 검색창 -->
      <div class="mb-4">
        <div class="relative">
          <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      <!-- 필터 옵션 -->
      <div class="space-y-3">
        <!-- 카테고리 필터 -->
        <div class="space-y-2">
          <div class="flex items-center gap-2" id="breadcrumb-container">
            ${Breadcrumb()}
          </div>
          <!-- 1depth 카테고리 -->
          <div class="flex flex-wrap gap-2">
          ${
            isLoading
              ? Loading({ type: "category" })
              : !store.get("params")["category1"]
                ? Object.keys(categories)
                    .map(
                      (category1) => /* html */ `
                  <button
                  data-category1="${category1}"
                  class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
              bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ${category1}
                  </button>
                  `,
                    )
                    .join("")
                : ""
          }
        <!-- 2depth 카테고리 -->
        
          ${
            store.get("params")["category1"] && categories[store.get("params")["category1"]]
              ? Object.keys(categories[store.get("params")["category1"]])
                  .map(
                    (category2) => `
                      <button
                        data-category2="${category2}"
                        class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                          bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        ${category2}
                      </button>
                    `,
                  )
                  .join("")
              : ""
          }
  
          
          </div>
          <!-- 2depth 카테고리 -->
        </div>
        <!-- 기존 필터들 -->
        <div class="flex gap-2 items-center justify-between">
          <!-- 페이지당 상품 수 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="10">
                10개
              </option>
              <option value="20" selected>
                20개
              </option>
              <option value="50">
                50개
              </option>
              <option value="100">
                100개
              </option>
            </select>
          </div>
          <!-- 정렬 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">정렬:</label>
            <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                          focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="price_asc" selected>가격 낮은순</option>
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
