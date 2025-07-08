const CountOptions = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 50, label: "50개" },
  { value: 100, label: "100개" },
];

export const ItemCount = (count) => {
  console.log(count);
  return /* HTML */ `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">개수:</label>
      <select
        id="limit-select"
        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        ${CountOptions.map(
          (option) => `
                  <option value="${option.value}" ${count === option.value ? "selected" : ""}>
                    ${option.label}
                  </option>
                `,
        ).join("")}
      </select>
    </div>
  `;
};
