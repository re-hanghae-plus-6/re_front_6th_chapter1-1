function Category({ loading = false, categories = {}, selectedCategory1, selectedCategory2 }) {
  if (loading) {
    return Loading();
  }

  return CategoryView({ categories, selectedCategory1, selectedCategory2 });
}

function Loading() {
  return /* HTML */ `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
      </div>
    </div>
  `;
}

function CategoryView({ categories, selectedCategory1, selectedCategory2 }) {
  // 브레드크럼 생성
  const breadcrumbParts = ["전체"];
  if (selectedCategory1) breadcrumbParts.push(selectedCategory1);
  if (selectedCategory2) breadcrumbParts.push(selectedCategory2);

  const breadcrumbHTML = breadcrumbParts
    .map((part, index) => {
      if (index === 0) {
        return `<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">${part}</button>`;
      } else if (index === breadcrumbParts.length - 1) {
        // 마지막 요소는 클릭 불가능한 텍스트
        return `<span class="text-xs text-gray-700">${part}</span>`;
      } else {
        // 중간 요소는 클릭 가능한 버튼
        return `<button data-breadcrumb="category1" data-category1="${part}" class="text-xs hover:text-blue-800 hover:underline">${part}</button>`;
      }
    })
    .join('<span class="text-xs text-gray-500">&gt;</span>');

  // 현재 표시할 카테고리 버튼들 결정
  let categoryButtons = "";

  if (selectedCategory2) {
    // 2depth 선택됨 → 더 이상 표시할 카테고리 없음
    categoryButtons = "";
  } else if (selectedCategory1) {
    // 1depth 선택됨 → 2depth 카테고리들 표시
    const category2List = Object.keys(categories[selectedCategory1] || {});
    categoryButtons = category2List
      .map(
        (category2) => `
      <button
        data-category1="${selectedCategory1}"
        data-category2="${category2}"
        class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        ${category2}
      </button>
    `,
      )
      .join("");
  } else {
    // 아무것도 선택 안됨 → 1depth 카테고리들 표시
    const category1List = Object.keys(categories);
    categoryButtons = category1List
      .map(
        (category1) => `
      <button
        data-category1="${category1}"
        class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        ${category1}
      </button>
    `,
      )
      .join("");
  }

  return /* HTML */ `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        ${breadcrumbHTML}
      </div>
      ${categoryButtons ? `<div class="flex flex-wrap gap-2">${categoryButtons}</div>` : ""}
    </div>
  `;
}

export default Category;
