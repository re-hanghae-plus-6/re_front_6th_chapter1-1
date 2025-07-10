import { router } from "../../../routes";

function PerPageCountSelect() {
  // 컴포넌트 마운트 후 이벤트 리스너와 구독 설정
  setTimeout(() => {
    const limitSelect = document.querySelector("#limit-select");
    if (!limitSelect) return;

    // 현재 limit 파라미터 값으로 초기화
    const currentLimit = router.getSearchParams().limit || "20";
    limitSelect.value = currentLimit;

    // limit 파라미터 변경 구독
    const unsubscribeLimit = router.subscribeSearchParams("limit", (limitValue) => {
      limitSelect.value = limitValue || "20";
    });

    // change 이벤트 리스너
    const handleChange = (event) => {
      const limitValue = event.target.value;
      router.updateSearchParams({
        limit: limitValue,
        page: 1, // 페이지당 개수 변경 시 첫 페이지로 이동
      });
    };

    limitSelect.addEventListener("change", handleChange);

    // cleanup 함수를 전역에 저장
    if (!window.limitSelectCleanup) {
      window.limitSelectCleanup = [];
    }
    window.limitSelectCleanup.push(() => {
      unsubscribeLimit();
      limitSelect.removeEventListener("change", handleChange);
    });
  }, 0);

  return /* HTML */ `
    <div class="flex items-center gap-2">
      <label class="text-sm text-gray-600">개수:</label>
      <select
        id="limit-select"
        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="10">10개</option>
        <option value="20" selected="">20개</option>
        <option value="50">50개</option>
        <option value="100">100개</option>
      </select>
    </div>
  `;
}

export default PerPageCountSelect;
