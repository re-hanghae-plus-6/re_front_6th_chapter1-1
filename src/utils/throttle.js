/**
 * func 호출을 최대 1회 / wait 밀리초로 제한
 *
 * @param {Function} func 호출할 함수
 * @param {number} wait 제한 간격 (ms)
 */
export function throttle(func, wait) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}
