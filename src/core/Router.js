class Router {
  constructor() {
    // url이 변경되는 이벤트를 감지하기 위한 prevUrl
    this.prevUrl = location.pathname;

    window.addEventListener("popstate", () => {
      this.emitUrlChange();
    });
  }

  // 라우트 변경 -> 새로고침 없이 페이지 변경을 위해 history.pushState 사용
  push(state = {}, url) {
    history.pushState(state, "", url);
    this.emitUrlChange(); // 주소 변경되었는지 확인하는 이벤트 발생
  }

  // 라우트 Replace -> 앞으로 가기/뒤로가기 기록에 남기지 않음
  replace(state = {}, url) {
    history.replaceState(state, "", url);
    this.emitUrlChange(); // 주소 변경되었는지 확인하는 이벤트 발생
  }

  // 앞으로 가기
  go(n) {
    history.go(n);
  }

  // 뒤로 가기
  back() {
    history.back();
  }

  // 현재 URL 정보 가져오기
  getCurrentUrl() {
    return window.location.pathname;
  }

  // searchParams 정보 가져오기
  getParams() {
    return new URL(document.location).searchParams;
  }

  // this.push를 통해 url이 변경되었을 때를 감지
  emitUrlChange() {
    const currentUrl = location.pathname;
    if (this.prevUrl !== currentUrl) {
      const event = new CustomEvent("urlChange", {
        detail: {
          prevUrl: this.prevUrl,
          currentUrl,
          isChange: true,
        },
      });

      window.dispatchEvent(event);
      this.prevUrl = currentUrl;
    }
  }
}

export default Router;
