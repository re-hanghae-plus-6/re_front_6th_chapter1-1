import { LIMIT_OPTIONS, SORT_OPTIONS } from "../constants";

export function LimitSelect({ options = LIMIT_OPTIONS, selectedValue }) {
  return /*html */ `
    <!-- 페이지당 상품 수 -->
    <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">개수:</label>
        <select id="limit-select"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
            ${options
              .map(
                (option) => `
                <option value="${option.value}" ${selectedValue.toString() === option.value.toString() ? "selected" : ""}>
                    ${option.label}개
                </option>
            `,
              )
              .join("")}
        </select>
    </div>
  `;
}

export function SortSelect({ options = SORT_OPTIONS, selectedValue }) {
  return /*html */ `
    <!-- 정렬 -->
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">정렬:</label>
      <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
        ${options
          .map(
            (option) => `
          <option value="${option.value}" ${selectedValue === option.value ? "selected" : ""}>
            ${option.label}
          </option>
        `,
          )
          .join("")}    
      </select>
    </div>`;
}
