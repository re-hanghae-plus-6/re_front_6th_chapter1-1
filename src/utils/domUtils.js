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

/**
 * DOM 요소의 표시/숨김 토글
 * @param {string} selector - CSS 선택자
 * @param {boolean} show - 표시할지 여부
 */
export const toggleElementDisplay = (selector, show) => {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = show ? "block" : "none";
  }
};

/**
 * DOM 요소에 클래스 토글
 * @param {string} selector - CSS 선택자
 * @param {string} className - 토글할 클래스명
 * @param {boolean} force - 강제로 추가/제거할지 여부
 */
export const toggleElementClass = (selector, className, force) => {
  const element = document.querySelector(selector);
  if (element) {
    element.classList.toggle(className, force);
  }
};

/**
 * 여러 요소를 한 번에 업데이트
 * @param {Object} updates - {selector: content} 형태의 객체
 */
export const updateElements = (updates) => {
  Object.entries(updates).forEach(([selector, content]) => {
    updateElement(selector, content);
  });
};
