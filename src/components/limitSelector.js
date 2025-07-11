export const limitSelector = (selectedLimit) => {
  const options = [10, 20, 50, 100].map(
    (val) => `<option value="${val}" ${val === selectedLimit ? "selected" : ""}>${val}개</option>`,
  );

  return `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">개수:</label>
      <select id="limit-select"
        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
         ${options}
      </select>
    </div>
  `;
};
