import { router } from "../../../routes";

function SortSelect() {
  // 컴포넌트 마운트 후 이벤트 리스너와 구독 설정
  setTimeout(() => {
    const sortSelect = document.querySelector("#sort-select");
    if (!sortSelect) return;

    // 현재 sort 파라미터 값으로 초기화
    const currentSort = router.getSearchParams().sort || "price_asc";
    sortSelect.value = currentSort;

    // sort 파라미터 변경 구독
    const unsubscribeSort = router.subscribeSearchParams("sort", (sortValue) => {
      sortSelect.value = sortValue || "price_asc";
    });

    // change 이벤트 리스너
    const handleChange = (event) => {
      const sortValue = event.target.value;
      router.updateSearchParams({
        sort: sortValue,
        page: 1, // 정렬 변경 시 첫 페이지로 이동
      });
    };

    sortSelect.addEventListener("change", handleChange);

    // cleanup 함수를 전역에 저장
    if (!window.sortSelectCleanup) {
      window.sortSelectCleanup = [];
    }
    window.sortSelectCleanup.push(() => {
      unsubscribeSort();
      sortSelect.removeEventListener("change", handleChange);
    });
  }, 0);

  return /* HTML */ `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">정렬:</label>
      <select
        id="sort-select"
        class="text-sm border border-gray-300 rounded px-2 py-1
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="price_asc" selected="">가격 낮은순</option>
        <option value="price_desc">가격 높은순</option>
        <option value="name_asc">이름순</option>
        <option value="name_desc">이름 역순</option>
      </select>
    </div>
  `;
}

export default SortSelect;
