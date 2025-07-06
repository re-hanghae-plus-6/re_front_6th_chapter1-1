export const Breadcrumb = ({ category1 = "", category2 = "" }) => `
    <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">카테고리:</label>
        <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button><span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${category1}" class="text-xs hover:text-blue-800 hover:underline">${category1}</button><span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${category2}</span>
    </div>
`;
