// return이 void | (() => void) 두 케이스가 있는 이유: 클린업 할게 없을 경우도 있기 때문
export type PageFn = (pathParams?: Record<string, string>, queryParams?: Record<string, string>) => void | (() => void);

interface RouteObj {
  routeRegex: RegExp;
  pageFn: PageFn;
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
  currentCleanup?.();
  currentCleanup = undefined;

  // URL 객체를 사용해 pathname 과 query 분리
  const url = new URL(urlStr, location.origin);
  const pathname = url.pathname;
  const queryParams = Object.fromEntries(url.searchParams.entries()) as Record<string, string>;

  const hasMatched = routes.some(({ routeRegex, pageFn }) => {
    const match = routeRegex.exec(pathname);
    if (!match) return false;

    const pathParams = (match.groups ?? {}) as Record<string, string>;

    // 페이지 렌더 후 cleanup이 필요하다면 ()=> void 형태로 저장
    const willCleanup = pageFn(pathParams, queryParams);
    if (typeof willCleanup === "function") currentCleanup = willCleanup;
    return true;
  });

  if (!hasMatched) {
    document.getElementById("root")!.textContent = "404 | 페이지를 찾을 수 없습니다";
  }
}

function navigate(path: string, replace = false) {
  if (replace) history.replaceState(null, "", path);
  else history.pushState(null, "", path);
  render(path);
}

// routeMap: { '/': fn, ... }
function initRouter(routeMap: Record<string, PageFn>) {
  routes = Object.keys(routeMap).map((pattern) => ({
    routeRegex: compile(pattern),
    pageFn: routeMap[pattern],
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
