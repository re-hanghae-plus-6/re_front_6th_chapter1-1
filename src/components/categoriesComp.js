// TODO: 검색창을 필터에 포함해야할지?
export const categoriesComp = (categories, loading) => {
  const categoryListHtml =
    loading === false && Object.keys(categories).length > 0
      ? Object.keys(categories)
          .map(
            (name) => /*html*/ `
        <button data-category-id="" class="category-btn text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full">
          ${name}
        </button>
      `,
          )
          .join("")
      : '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>';

  return /*html*/ `
  <!-- 필터 옵션 -->
  <div id="categories" class="space-y-3">
    <!-- 카테고리 필터 -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      </div>
      <!-- 1depth 카테고리 -->
      <div class="flex flex-wrap gap-2">
        ${categoryListHtml}
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
          <option value="20" selected="">
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
          <option value="price_asc" selected="">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
          <option value="name_asc">이름순</option>
          <option value="name_desc">이름 역순</option>
        </select>
      </div>
    </div>
  </div>
  `;
};
