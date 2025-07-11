import {
  HomePageView,
  NotFoundPageView,
  ProductDetailPageView,
  ProductListHeaderComponent,
  ProductDetailHeaderComponent,
} from "@/views";
import { getElement } from "@/utils";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const navigateTo = (url) => {
  console.log(getFullPath(url), url);
  history.pushState(null, "", url);
  router();
};

/**
 * 현재 URL의 search params를 가져오는 함수
 * @returns {URLSearchParams} 현재 URL의 search params
 */
const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

/**
 * URL의 search params를 업데이트하는 함수 (히스토리에 추가하지 않음)
 * @param {Object} params - 업데이트할 파라미터 객체
 * @param {Object} options - 옵션 (기본값 제거 등)
 */
const updateSearchParams = (params, options = {}) => {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;

  // 각 파라미터를 순회하며 처리
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      // 기본값과 같은지 확인
      const isDefaultValue = options.defaults && options.defaults[key] === value;

      if (isDefaultValue) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value.toString());
      }
    } else {
      urlParams.delete(key);
    }
  });

  // URL 업데이트 (히스토리에 추가하지 않음)
  const newUrl = url.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");
  window.history.replaceState(null, "", newUrl);
};

/**
 * 현재 URL을 새로운 URL로 교체하는 함수 (히스토리에 추가하지 않음)
 * @param {string} newUrl - 새로운 URL
 */
const replaceURL = (newUrl) => {
  window.history.replaceState(null, "", newUrl);
};

/**
 * 특정 search param 값을 가져오는 함수
 * @param {string} key - 파라미터 키
 * @param {string} defaultValue - 기본값
 * @returns {string} 파라미터 값 또는 기본값
 */
const getSearchParam = (key, defaultValue = "") => {
  const params = getSearchParams();
  return params.get(key) || defaultValue;
};

/**
 * popstate 이벤트 리스너를 추가하는 함수
 * @param {Function} handler - 이벤트 핸들러
 */
const addPopstateListener = (handler) => {
  window.addEventListener("popstate", handler);
};

/**
 * popstate 이벤트 리스너를 제거하는 함수
 * @param {Function} handler - 이벤트 핸들러
 */
const removePopstateListener = (handler) => {
  window.removeEventListener("popstate", handler);
};

export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

const router = async () => {
  const routes = [
    { path: getFullPath("/"), view: HomePageView, header: ProductListHeaderComponent },
    { path: getFullPath("/product/:id"), view: ProductDetailPageView, header: ProductDetailHeaderComponent },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => ({
    route: route,
    result: location.pathname.match(pathToRegex(route.path)),
  }));

  let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

  // 매치되지 않는 경우 404 페이지 표시
  if (!match) {
    match = {
      route: { path: "/404", view: NotFoundPageView, header: null },
      result: [location.pathname],
    };
  }

  // URL 파라미터 추출
  const params = {};
  if (match.result && match.route.path !== "/404") {
    const paramNames = match.route.path.match(/:(\w+)/g);
    if (paramNames) {
      paramNames.forEach((paramName, index) => {
        const key = paramName.substring(1); // : 제거
        params[key] = match.result[index + 1];
      });
    }
  }

  // #main 요소를 타겟으로 변경
  const mainElement = getElement("#main");
  const headerElement = getElement("#header-container");

  // mainElement가 없으면 라우팅을 중단 (앱이 아직 렌더링되지 않았을 수 있음)
  if (!mainElement) {
    console.warn("Main element not found. Skipping routing.");
    return;
  }

  if (!headerElement) {
    console.warn("Header element not found Skipping routing.");
    return;
  }

  // 기존 뷰 인스턴스 정리
  if (mainElement._viewInstance && mainElement._viewInstance.componentWillUnmount) {
    mainElement._viewInstance.componentWillUnmount();
  }

  if (headerElement._viewInstance && headerElement._viewInstance.componentWillUnmount) {
    headerElement._viewInstance.componentWillUnmount();
  }

  // 새로운 컴포넌트 인스턴스 생성 및 렌더링 (파라미터 전달)
  const view = new match.route.view(mainElement, params);
  const header = match.route.header ? new match.route.header(headerElement, params) : null;
  mainElement.innerHTML = view.template();
  headerElement.innerHTML = header ? header.template() : "";

  // 뷰 인스턴스를 메인 요소에 저장
  mainElement._viewInstance = view;

  // 컴포넌트 마운트 이벤트 호출
  if (view.componentDidMount) {
    view.componentDidMount();
  }

  if (header && header.componentDidMount) {
    header.componentDidMount();
  }
};

export {
  router,
  navigateTo,
  getSearchParams,
  updateSearchParams,
  replaceURL,
  getSearchParam,
  addPopstateListener,
  removePopstateListener,
};
