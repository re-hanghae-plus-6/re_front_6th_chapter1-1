/**
 * SPA 라우팅을 위한 Router 클래스
 * - 경로와 컴포넌트를 등록하고, SPA 방식으로 페이지 이동/렌더링을 관리한다.
 */
export class Router {
  /**
   * Router 인스턴스를 생성한다.
   * 라우트 테이블(Map)을 초기화하고 popstate 이벤트를 바인딩한다.
   */
  constructor() {
    /** @type {Map<string, {component: Function}>} */
    this.routes = new Map();
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  /**
   * 새로운 라우트를 등록한다.
   * @param {string} path - 경로(예: "/about")
   * @param {{component: Function}} routeObj - 컴포넌트 객체 (예: { component: HomePage })
   */
  addRoute(path, routeObj) {
    this.routes.set(path, routeObj);
  }

  /**
   * SPA 방식으로 경로를 이동시킨다.
   * @param {string} path - 이동할 경로
   */
  navigateTo(path) {
    history.pushState(null, '', path);
    this.handleRoute(path);
  }

  /**
   * popstate 이벤트(뒤로가기/앞으로가기) 발생 시 실행되는 핸들러.
   * 현재 주소에 맞는 컴포넌트를 렌더링한다.
   * @private
   */
  handlePopState() {
    this.handleRoute(window.location.pathname);
  }

  /**
   * 현재 경로에 맞는 컴포넌트를 root 영역에 렌더링한다.
   * @param {string} path - 렌더링할 경로
   */
  handleRoute(path) {
    const route = this.routes.get(path) || this.routes.get('/404');
    document.getElementById('root').innerHTML = route.component();
  }

  /**
   * Router를 초기화하여 최초 페이지를 렌더링한다.
   */
  init() {
    this.handleRoute(window.location.pathname);
  }
}
