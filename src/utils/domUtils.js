/**
 * DOM 요소의 innerHTML을 안전하게 업데이트
 * @param {string} selector - CSS 선택자
 * @param {string} content - 새로운 HTML 내용
 */
export const updateElement = (selector, content) => {
  const element = document.querySelector(selector);
  if (element && element.innerHTML !== content) {
    element.innerHTML = content;
  }
};
