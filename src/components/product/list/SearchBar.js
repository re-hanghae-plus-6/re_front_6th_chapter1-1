import { router } from "../../../routes";

function SearchBar() {
  // 컴포넌트 마운트 후 이벤트 리스너와 구독 설정
  setTimeout(() => {
    const searchInput = document.querySelector("#search-input");
    if (!searchInput) return;

    // 현재 search 파라미터 값으로 초기화
    const currentSearch = router.getSearchParams().search || "";
    searchInput.value = currentSearch;

    // search 파라미터 변경 구독
    const unsubscribeSearch = router.subscribeSearchParams("search", (searchValue) => {
      searchInput.value = searchValue || "";
    });

    // Enter 키 이벤트 리스너
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        const searchValue = event.target.value.trim();
        router.updateSearchParams({
          search: searchValue || null, // 빈 문자열은 null로 처리하여 URL에서 제거
          page: 1, // 검색 시 첫 페이지로 이동
        });
      }
    };

    searchInput.addEventListener("keypress", handleKeyPress);

    // cleanup 함수를 전역에 저장
    if (!window.searchBarCleanup) {
      window.searchBarCleanup = [];
    }
    window.searchBarCleanup.push(() => {
      unsubscribeSearch();
      searchInput.removeEventListener("keypress", handleKeyPress);
    });
  }, 0);

  return /* HTML */ `
    <div class="mb-4">
      <div class="relative">
        <input
          type="text"
          id="search-input"
          placeholder="상품명을 검색해보세요..."
          value=""
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  `;
}

export default SearchBar;
