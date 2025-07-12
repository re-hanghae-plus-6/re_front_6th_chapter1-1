/**
 * 현재 스크롤 위치가 하단 임계점에 도달했는지 확인
 * @param {number} threshold - 하단에서부터의 거리 (px)
 * @returns {boolean}
 */
export const isNearBottom = (threshold = 100) => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  return scrollTop + clientHeight >= scrollHeight - threshold;
};

/**
 * 스크롤 이벤트 쓰로틀링을 위한 래퍼
 * @param {Function} callback - 실행할 콜백 함수
 * @returns {Function} 쓰로틀된 함수
 */
export const createThrottledScrollHandler = (callback) => {
  let isScrolling = false;

  return () => {
    if (isScrolling) return;
    isScrolling = true;

    requestAnimationFrame(() => {
      callback();
      isScrolling = false;
    });
  };
};

/**
 * 무한 스크롤 설정
 * @param {Object} options - 설정 옵션
 * @param {Function} options.onLoadMore - 더 로드할 때 실행할 함수
 * @param {number} options.threshold - 하단 임계점 거리 (기본값: 100px)
 * @param {Function} options.shouldLoad - 로드 가능 여부를 판단하는 함수 (옵션)
 * @returns {Function} cleanup 함수
 */
export const setupInfiniteScroll = ({ onLoadMore, threshold = 100, shouldLoad = () => true }) => {
  const handleScroll = () => {
    if (isNearBottom(threshold) && shouldLoad()) {
      onLoadMore();
    }
  };

  const throttledHandler = createThrottledScrollHandler(handleScroll);

  window.addEventListener("scroll", throttledHandler, { passive: true });

  return () => {
    window.removeEventListener("scroll", throttledHandler);
  };
};
