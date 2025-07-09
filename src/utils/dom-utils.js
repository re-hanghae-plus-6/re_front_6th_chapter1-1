import {
  handleSearchKeydown,
  handleOptionChange,
  handleCategoryClick,
  handleInfiniteScroll,
} from "./event-handlers.js";

/**
 * 루트 엘리먼트 가져오기
 */
export const getRootElement = () => {
  const root = document.getElementById("root");
  if (!root) {
    console.error("Root element not found");
  }
  return root;
};

/**
 * 상품 목록 관련 DOM 이벤트 리스너 설정
 */
export const setupProductListEventListeners = () => {
  const root = getRootElement();
  if (!root) return;

  // 검색 이벤트
  root.addEventListener("keydown", handleSearchKeydown);

  // 정렬 변경 이벤트
  root.addEventListener("change", handleOptionChange);

  // 카테고리 필터 이벤트
  root.addEventListener("click", handleCategoryClick);
};

/**
 * 무한 스크롤 이벤트 리스너 설정
 */
export const setupScrollEventListener = () => {
  window.addEventListener("scroll", handleInfiniteScroll);
};

/**
 * 무한 스크롤 이벤트 리스너 해제
 */
export const removeScrollEventListener = () => {
  window.removeEventListener("scroll", handleInfiniteScroll);
};

/**
 * 로딩 UI 표시
 */
export const showLoadingUI = () => {
  const root = getRootElement();
  if (!root) return;

  root.innerHTML = `
    <div style="text-align: center; padding: 50px;">
      <h2>로딩 중...</h2>
    </div>
  `;
};
