const sortOptions = [
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
  { value: "name_desc", label: "이름 역순" },
];

export const Sort = (sort) => {
  return /* HTML */ `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">정렬:</label>
      <select
        id="sort-select"
        class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        ${sortOptions
          .map(
            (option) => `
                  <option value="${option.value}" ${sort === option.value && "selected"}>
                    ${option.label}
                  </option>
                `,
          )
          .join("")}
      </select>
    </div>
  `;
};
