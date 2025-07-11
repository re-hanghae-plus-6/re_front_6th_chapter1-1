export function useInfiniteScroll(loadMore, { threshold = 300 } = {}) {
  let ticking = false;

  function onScroll() {
    if (ticking) return;

    requestAnimationFrame(() => {
      const { scrollTop } = document.documentElement;
      const viewport = window.innerHeight;
      const full = document.documentElement.scrollHeight;

      if (full - (scrollTop + viewport) < threshold) loadMore();
      ticking = false;
    });

    ticking = true;
  }

  window.addEventListener("scroll", onScroll);

  // 컴포넌트 언마운트 시 호출해 메모리 누수 방지
  return () => window.removeEventListener("scroll", onScroll);
}
