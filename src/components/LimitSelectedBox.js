export const LimitSelectedBox = ({ value = 20 }) => {
  return /*html*/ `
        <label class="text-sm text-gray-600">개수:</label>
        <select id="limit-select"
          class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <option value="10" ${value == 10 ? "selected" : ""}>10개</option>
          <option value="20" ${value == 20 ? "selected" : ""}>20개</option>
          <option value="50" ${value == 50 ? "selected" : ""}>50개</option>
          <option value="100" ${value == 100 ? "selected" : ""}>100개</option>
        </select>
      `;
};
