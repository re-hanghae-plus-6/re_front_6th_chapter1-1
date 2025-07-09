const useNavigate = () => {
  // 전 URL과 현재 URL을 비교하여 커스텀 이벤트 생성
  let prevUrl = location.pathname;

  const emitUrlChangeEvent = () => {
    const currentUrl = location.pathname;
    if (prevUrl !== currentUrl) {
      const event = new CustomEvent("urlChange", {
        detail: {
          prevUrl,
          currentUrl,
          isUrlChange: prevUrl !== currentUrl,
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
