// 페이지 모듈: HTML 문자열을 반환하는 render와 선택적인 mount 훅으로 구성됩니다.
export interface PageModule {
  render: (pathParams?: Record<string, string>, queryParams?: Record<string, string>) => string;
  /**
   * DOM 이 실제로 삽입된 뒤 호출됩니다.
   * 반환값이 함수라면 언마운트 시(cleanup) 호출됩니다.
   */
  mount?: (root: HTMLElement) => void | (() => void);
}

interface RouteObj {
  routeRegex: RegExp;
  page: PageModule;
}

let routes: RouteObj[] = [];
let currentCleanup: (() => void) | undefined;

function compile(pattern: string): RegExp {
  // ^ … $ : 문자열의 시작과 끝을 고정해 완전 일치만 통과
  // '/product/:id' → '^/product/(?<id>[^/]+)$'
  const regexStr = "^" + pattern.replace(/:([^/]+)/g, (_, key) => `(?<${key}>[^/]+)`) + "$";
  return new RegExp(regexStr);
}

function render(urlStr: string) {
  // 1) 이전 페이지 정리
  currentCleanup?.();
  currentCleanup = undefined;

  // 2) URL 분해
  const url = new URL(urlStr, location.origin);
  const pathname = url.pathname;
  const queryParams = Object.fromEntries(url.searchParams.entries()) as Record<string, string>;

  // 3) 매칭되는 라우트 탐색
  const matched = routes.find(({ routeRegex }) => routeRegex.test(pathname));

  if (!matched) {
    document.getElementById("root")!.textContent = "404 | 페이지를 찾을 수 없습니다";
    return;
  }

  const { routeRegex, page } = matched;
  const pathParams = (routeRegex.exec(pathname)?.groups ?? {}) as Record<string, string>;

  const rootEl = document.getElementById("root")!;

  // 4) HTML 삽입
  rootEl.innerHTML = page.render(pathParams, queryParams);

  // 5) mount 훅 실행 후 cleanup 저장
  if (page.mount) {
    const maybeCleanup = page.mount(rootEl);
    if (typeof maybeCleanup === "function") currentCleanup = maybeCleanup;
  }
}

function navigate(path: string, replace = false) {
  if (replace) history.replaceState(null, "", path);
  else history.pushState(null, "", path);
  render(path);
}

// routeMap: { '/': fn, ... }
function initRouter(routeMap: Record<string, PageModule>) {
  routes = Object.keys(routeMap).map((pattern) => ({
    routeRegex: compile(pattern),
    page: routeMap[pattern],
  }));

  document.addEventListener("click", (e) => {
    // 클릭한 요소의 가장 가까운 data-link 속성을 가진 a태그는 라우팅을 수행(a태그의 기본동작 인터셉트)
    const a = (e.target as HTMLElement).closest("a[data-link]") as HTMLAnchorElement | null;
    if (!a) return;
    e.preventDefault();
    navigate(a.pathname + a.search);
  });

  // 앞으로/뒤로 가기 동작 시 현재 URL 전체(path + query)로 다시 렌더
  window.addEventListener("popstate", () => render(location.pathname + location.search));

  // 최초 페이지 유입 시 페이지를 그려줌 (쿼리 포함)
  render(location.pathname + location.search);
}

export { initRouter, navigate };
