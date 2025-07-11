/**
 * 디바운싱 함수
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Function} 디바운싱된 함수
 */
export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // 이전 타이머가 있다면 취소
    clearTimeout(timeoutId);

    // 새로운 타이머 설정
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 즉시 실행 옵션이 있는 디바운싱 함수
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @param {boolean} immediate - 첫 번째 호출을 즉시 실행할지 여부
 * @returns {Function} 디바운싱된 함수
 */
export function debounceWithImmediate(func, delay, immediate = false) {
  let timeoutId;

  return function (...args) {
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, delay);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

/**
 * 취소 기능이 있는 디바운싱 함수
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Object} 디바운싱된 함수와 취소 함수를 포함한 객체
 */
export function debounceWithCancel(func, delay) {
  let timeoutId;

  const debouncedFn = function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  const cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return {
    fn: debouncedFn,
    cancel: cancel,
  };
}

// 기본 export
export default debounce;
