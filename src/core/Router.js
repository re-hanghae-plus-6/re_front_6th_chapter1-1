import { Component } from "./Component";

/**
 * 클라이언트 사이드 라우터 클래스
 *
 * @description
 * - URL 변경을 감지하고 해당하는 컴포넌트를 렌더링하도록 구성합니다.
 */
export class Router {
  #routes = new Map();
  #currentRoute = null;
  #container = null;
  #currentComponent = null;
  #currentRouteParams = {};
  #currentQueryParams = {};
  #popstateListener = this.#handleRouteChange.bind(this);
  #baseUrl = "";

  constructor(containerQuerySelector) {
    this.#container = document.querySelector(containerQuerySelector);
    if (!this.#container) {
      throw new Error(`${containerQuerySelector}에 해당되는 엘리먼트를 찾을 수 없습니다.`);
    }

    // baseUrl 설정 - 끝 슬래시 제거하여 정규화
    const rawBaseUrl = import.meta.env.BASE_URL || "/";
    this.#baseUrl = rawBaseUrl === "/" ? "" : rawBaseUrl.replace(/\/$/, "");

    // popstate 이벤트 리스너를 등록하여 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", this.#popstateListener);
  }

  get routeParams() {
    return { ...this.#currentRouteParams };
  }

  get queryParams() {
    return { ...this.#currentQueryParams };
  }

  /**
   * 현재 활성화된 컴포넌트를 반환
   *
   * @returns {Component|null} 현재 컴포넌트 인스턴스
   */
  get currentComponent() {
    return this.#currentComponent;
  }

  /**
   * 경로와 컴포넌트를 등록하는 메소드
   *
   * @param {string} path - URL 경로 (예: '/', '/about', '*')
   * @param {Function|Object} componentConstructor - 컴포넌트 클래스
   *
   * @example
   * router.register('/', ProductListPage);
   */
  register(path, componentConstructor) {
    if (typeof path !== "string") {
      throw new Error("경로를 문자열로 입력해주세요");
    }

    // 라우트는 baseUrl 없이 상대 경로로 저장
    this.#routes.set(path, componentConstructor);
  }

  /**
   * 라우터를 시작하는 메소드
   *
   * @description (중요!) 모든 라우트 등록이 완료된 후 호출해야 합니다.
   *
   * @example
   * router.register('/', ProductListPage);
   * router.start(); // 현재 URL에 맞는 페이지 렌더링
   */
  start() {
    console.table([...this.#routes].map(([path, componentConstructor]) => ({ path, page: componentConstructor.name })));
    this.#handleRouteChange();
  }

  /**
   * 등록된 모든 라우트를 제거하고 라우터 상태를 초기화합니다.
   */
  clear() {
    // 현재 컴포넌트가 있다면 언마운트
    this.#unmountCurrentComponent();

    this.#routes.clear();
    this.#currentRoute = null;
    this.#container = null;
    this.#currentComponent = null;
    window.removeEventListener("popstate", this.#popstateListener);
  }

  /**
   * 지정된 경로로 네비게이션을 처리하는 메소드
   *
   * @description 브라우저 히스토리에 새 항목을 추가하고 컴포넌트를 렌더링합니다.
   *
   * @param {string} path - 이동할 URL 경로
   *
   * @example
   * router.navigate('/about');        // /about 페이지로 이동
   * router.navigate('/product/123');  // /product/123 페이지로 이동
   */
  navigate(path) {
    if (typeof path !== "string") {
      throw new Error("경로를 문자열로 입력해주세요");
    }

    // baseUrl과 path를 올바르게 결합
    const fullPath = this.#buildFullPath(path);

    if (this.#currentRoute !== path) {
      window.history.pushState({}, "", fullPath);
      this.#handleRouteChange();
    }
  }

  /**
   * 현재 컴포넌트를 언마운트하고 정리하는 메소드
   *
   * @private
   */
  #unmountCurrentComponent() {
    if (this.#currentComponent && this.#currentComponent.isMounted) {
      try {
        this.#currentComponent.unmount();
      } catch (error) {
        console.error("컴포넌트 언마운트 중 오류 발생:", error);
      }
    }
    this.#currentComponent = null;
  }

  /**
   * baseUrl과 path를 올바르게 결합하여 전체 경로 생성
   *
   * @param {string} path - 상대 경로
   * @returns {string} 전체 경로
   *
   * @private
   */
  #buildFullPath(path) {
    if (!this.#baseUrl) {
      return path;
    }

    // path가 '/'로 시작하지 않으면 추가
    const normalizedPath = path.startsWith("/") ? path : "/" + path;
    return this.#baseUrl + normalizedPath;
  }

  /**
   * 현재 pathname에서 baseUrl을 제거하여 상대 경로 반환
   *
   * @param {string} pathname - 전체 pathname
   * @returns {string} baseUrl이 제거된 상대 경로
   *
   * @private
   */
  #extractRoutePath(pathname) {
    if (!this.#baseUrl) {
      return pathname;
    }

    if (pathname.startsWith(this.#baseUrl)) {
      const routePath = pathname.slice(this.#baseUrl.length) || "/";
      return routePath;
    }

    // baseUrl로 시작하지 않으면 404 처리를 위해 원본 반환
    return pathname;
  }

  /**
   * 라우트 패턴을 정규식으로 변환
   *
   * @param {string} pattern - 라우트 패턴 (예: '/product/:productId')
   * @returns {Object} 정규식과 파라미터 이름 배열
   *
   * @private
   */
  #parseRoutePattern(pattern) {
    if (pattern === "*") {
      return { regex: /.*/, paramNames: [] };
    }

    const paramNames = [];

    // :paramName 형태를 ([^/]+)로 변환하고 파라미터 이름 저장
    const regexPattern = pattern.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });

    // 정확한 매칭을 위해 ^ 시작과 $ 끝 추가
    const regex = new RegExp(`^${regexPattern}$`);

    return {
      regex,
      paramNames,
    };
  }

  /**
   * 현재 경로와 등록된 라우트 패턴을 매칭
   *
   * @param {string} currentPath - 현재 URL 경로
   * @returns {Object|null} 매칭된 컴포넌트와 파라미터 정보
   *
   * @private
   */
  #matchRoute(currentPath) {
    // 1. 정확한 매칭 먼저 확인
    if (this.#routes.has(currentPath)) {
      return {
        componentConstructor: this.#routes.get(currentPath),
        params: {},
        matchedPattern: currentPath,
      };
    }

    // 2. 동적 라우트 매칭
    for (const [pattern, componentConstructor] of this.#routes) {
      if (pattern === "*") continue; // 와일드카드는 마지막에 처리

      const { regex, paramNames } = this.#parseRoutePattern(pattern);
      const match = currentPath.match(regex);

      if (match) {
        // 매칭된 그룹들을 파라미터 객체로 변환
        const params = {};
        paramNames.forEach((paramName, index) => {
          params[paramName] = match[index + 1];
        });

        return {
          componentConstructor,
          params,
          matchedPattern: pattern,
        };
      }
    }

    // 3. 와일드카드 라우트는 404 페이지
    if (this.#routes.has("*")) {
      return {
        componentConstructor: this.#routes.get("*"),
        params: {},
        matchedPattern: "*",
      };
    }

    return null;
  }

  /**
   * URL에서 쿼리 파라미터를 파싱
   *
   * @param {string} search - URL의 search 부분 (예: '?page=1&limit=10')
   * @returns {Object} 쿼리 파라미터 객체
   *
   * @private
   */
  #parseQueryParams(search) {
    const params = {};
    if (!search) return params;

    const urlParams = new URLSearchParams(search);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }

    return params;
  }

  /**
   * 현재 URL에 맞는 컴포넌트를 찾아 렌더링
   *
   * @description popstate 이벤트나 navigate() 호출 시 자동으로 실행
   *
   * @private
   */
  async #handleRouteChange() {
    // 전체 pathname에서 baseUrl 제거하여 상대 경로 추출
    const routePath = this.#extractRoutePath(window.location.pathname);
    const queryParams = this.#parseQueryParams(window.location.search);
    const matchResult = this.#matchRoute(routePath);

    if (!matchResult) {
      throw new Error(`매칭되는 라우트가 없음, ${routePath}`);
    }

    // 같은 라우트로 이동하는 경우 중복 처리 방지
    if (this.#currentRoute === routePath && this.#currentComponent) {
      // 라우트 파라미터나 쿼리 파라미터만 업데이트
      this.#currentRouteParams = matchResult.params;
      this.#currentQueryParams = queryParams;
      return;
    }

    try {
      // 1. 기존 컴포넌트 언마운트
      this.#unmountCurrentComponent();

      // 2. 새로운 컴포넌트 생성 및 마운트
      const component = this.#createComponent(matchResult.componentConstructor);

      // 3. 상태 업데이트
      this.#currentRoute = routePath;
      this.#currentRouteParams = matchResult.params;
      this.#currentQueryParams = queryParams;
      this.#currentComponent = component;

      // 4. 새 컴포넌트 마운트
      console.log(`마운트: ${component.constructor.name} (경로: ${routePath})`);
      component.mount(this.#container);
    } catch (error) {
      console.error("라우트 변경 중 오류 발생:", error);

      // 오류 발생 시 정리
      this.#unmountCurrentComponent();
      throw error;
    }
  }

  /**
   * 컴포넌트 인스턴스 생성
   *
   * @description 클래스를 인자로 받아 컴포넌트 인스턴스를 생성하고 라우터 의존성을 주입한다.
   *
   * @private
   */
  #createComponent(componentConstructor) {
    try {
      // 컴포넌트 인스턴스 생성 시 라우터 의존성 주입
      const component = new componentConstructor({ router: this });

      if (!(component instanceof Component)) {
        throw new Error("컴포넌트는 추상클래스 Component를 상속해야 합니다!!");
      }

      return component;
    } catch (error) {
      if (error instanceof Error) {
        console.error("컴포넌트 인스턴스 생성 실패:", error.message);
        throw error;
      }
    }
  }
}
