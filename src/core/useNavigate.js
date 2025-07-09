const useNavigate = () => {
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

  return {
    push: (state = {}, url) => {
      history.pushState(state, "", url);
      emitUrlChangeEvent();
    },
    replace: (state = {}, url) => {
      history.replaceState(state, "", url);
      emitUrlChangeEvent();
    },
    go: (n) => {
      history.go(n);
    },
    back: () => {
      history.back();
    },
    getCurrentUrl: () => {
      return window.location.pathname;
    },
  };
};

export default useNavigate;
