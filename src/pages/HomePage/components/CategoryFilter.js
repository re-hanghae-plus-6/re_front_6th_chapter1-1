export default function CategoryFilter({ state }) {
  const { filters, categories } = state;

  return /*html */ `
    <div class="space-y-2">
        <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
        
        ${
          filters?.category1 &&
          /*html */ `&gt; <button data-breadcrumb="reset-category1" class="text-xs hover:text-blue-800 hover:underline">
           ${filters.category1}
            </button>`
        }
        
        ${
          filters?.category2 &&
          /*html */ `&gt; <button data-breadcrumb="reset-category2" class="text-xs hover:text-blue-800 hover:underline">
          ${filters.category2}
            </button>`
        }
        </div>
        ${
          state.loading
            ? '<div class="text-sm text-gray-500">카테고리 로딩 중...</div>'
            : /*html*/ `<!-- 1depth 카테고리 -->
        <div class="flex flex-wrap gap-2">
        ${
          !filters?.category1
            ? Object.keys(categories)
                .map(
                  (
                    category1,
                  ) => /*html*/ `<button data-category1="${category1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
            bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${category1}</button>`,
                )
                .join("")
            : ""
        }
        </div>`
        }
        <!-- 2depth 카테고리 -->
        ${
          !filters?.category2 && filters?.category1
            ? Object.keys(categories[filters.category1] || {})
                .map(
                  (
                    category2,
                  ) => /*html*/ `<button data-category2="${category2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${category2}</button>`,
                )
                .join("")
            : ""
        }
        </div>`;
}
