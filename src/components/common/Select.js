export const Select = ({ id, label, options, value }) => `
  <div class="flex items-center gap-2">
    <label class="text-sm text-gray-600" for="${id}">${label}:</label>
    <select
      id="${id}"
      class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      ${options
        .map(
          (opt) =>
            `<option value="${opt.value}"${opt.value.toString() === value.toString() ? " selected" : ""}>${opt.label}</option>`,
        )
        .join("")}
    </select>
  </div>`;
