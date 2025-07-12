export function throttle<T extends (...args: any[]) => void>(func: T, delay: number) {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
