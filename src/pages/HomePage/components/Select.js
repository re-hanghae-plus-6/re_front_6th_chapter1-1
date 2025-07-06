export function LimitSelect({ limittOptions = ["10", "20", "50", "100"], selectedValue }) {
  return /*html */ `
    <!-- 페이지당 상품 수 -->
    <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">개수:</label>
        <select id="limit-select"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
            ${limittOptions
              .map(
                (option) => `
                <option value="${option}" ${selectedValue === option ? "selected" : ""}>
                    ${option}개
                </option>
            `,
              )
              .join("")}
        </select>
    </div>
  `;
}
