const useNavigate = (() => {
  // 전 URL과 현재 URL을 비교하여 커스텀 이벤트 생성
  let prevUrl = location.pathname;
  let prevSearchParams = location.search;

  const emitUrlChangeEvent = () => {
    const currentUrl = location.pathname;
    const currentSearchParams = location.search;
    if (prevUrl !== currentUrl || prevSearchParams !== currentSearchParams) {
      const event = new CustomEvent("urlChange", {
        detail: {
          prevUrl,
          currentUrl,
          isUrlChange: prevUrl !== currentUrl,
          isSearchChange: prevSearchParams !== currentSearchParams,
        },
      });

      window.dispatchEvent(event);
      prevUrl = currentUrl;
    }
  };

  window.addEventListener("popstate", emitUrlChangeEvent);

  const push = (state = {}, url) => {
    history.pushState(state, "", url);
    emitUrlChangeEvent();
  };

  const replace = (state = {}, url) => {
    history.replaceState(state, "", url);
    emitUrlChangeEvent();
  };
  const go = (n) => {
    history.go(n);
  };
  const back = () => {
    history.back();
  };
  const getCurrentUrl = () => {
    return window.location.pathname;
  };

  return () => ({ push, replace, go, back, getCurrentUrl });
})();

export default useNavigate;
