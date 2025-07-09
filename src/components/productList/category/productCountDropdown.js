export const ProductCountDropdown = () => {
  const url = new URL(window.location.href);
  const limit = parseInt(url.searchParams.get("limit")) || 20;

  return `
<div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">개수:</label>
            <select id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="10" ${limit === 10 ? "selected" : ""}>
                10개
              </option>
              <option value="20" ${limit === 20 ? "selected" : ""}>
                20개
              </option>
              <option value="50" ${limit === 50 ? "selected" : ""}>
                50개
              </option>
              <option value="100" ${limit === 100 ? "selected" : ""}>
                100개
              </option>
            </select>
          </div>   
`;
};
