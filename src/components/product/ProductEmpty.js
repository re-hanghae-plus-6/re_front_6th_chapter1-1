export const ProductEmpty = (keyword) => {
  return /* HTML */ `
    <div
      class="flex flex-col items-center justify-center bg-white rounded-lg min-h-[300px] shadow-sm border border-gray-200 p-4 mb-4"
    >
      <!-- 검색 아이콘 -->
      <div class="mb-4">
        <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <!-- 메시지 -->
      <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          <span class="text-blue-500">"${keyword || ""}"</span>에 대한 검색 결과가 없습니다
        </h3>
        <p class="text-sm text-gray-500">다른 검색어를 입력해보세요 😥</p>
      </div>
    </div>
  `;
};
