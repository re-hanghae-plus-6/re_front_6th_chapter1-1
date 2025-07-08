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
  #popstateListener = this.#handleRouteChange.bind(this);

  constructor(containerQuerySelector) {
    this.#container = document.querySelector(containerQuerySelector);
    if (!this.#container) {
      throw new Error(`${containerQuerySelector}에 해당되는 엘리먼트를 찾을 수 없습니다.`);
    }

    // popstate 이벤트 리스너를 등록하여 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", this.#popstateListener);
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
    this.#routes.clear();
    this.#currentRoute = null;
    this.#container = null;
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

    if (this.#currentRoute !== path) {
      window.history.pushState({}, "", path);
      this.#handleRouteChange();
    }
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
    const currentPath = window.location.pathname;
    const queryParams = this.#parseQueryParams(window.location.search);
    const matchResult = this.#matchRoute(currentPath);

    if (!matchResult) {
      throw new Error(`매칭되는 라우트가 없음, ${currentPath}`);
    } else {
      this.#currentRoute = currentPath;
    }

    const component = this.#createComponent(matchResult.componentConstructor);
    component.mount(this.#container);

    if (typeof component.setRouteParams === "function") {
      // 페이지 컴포넌트에서 params를 사용하기 위해 메소드 실행
      component.setRouteParams(matchResult.params, queryParams);
    }

    // 해당 라우터에 대한 컴포넌트 그리기
    component.render();
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
      const component = new componentConstructor({ router: this.navigate });

      if (!(component instanceof Component)) {
        throw new Error("컴포넌트는 추상클래스 Component를 상속해야 합니다!!");
      }

      return component;
    } catch (error) {
      if (error instanceof Error) {
        console.error("컴포넌트 인스턴스 생성 실패:", error.message);
      }
    }
  }
}
