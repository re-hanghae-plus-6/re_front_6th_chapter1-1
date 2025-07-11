import { MainPage } from "../pages/MainPage/MainPage";
import { ProductDetailPage } from "../pages/ProductDetailPage/ProductDetailPage";
import { setRouteParams } from "../utils/store";
import { update } from "./renderer";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

export const createRouter = (routes) => {
  let currentRoute = null;

  const findRoute = (path) => {
    // 쿼리 파라미터 제거하고 pathname만으로 라우트 찾기
    const pathname = path.split("?")[0];

    // 프로덕션 환경에서 BASE_PATH 제거
    const cleanPath = import.meta.env.PROD ? pathname.replace(BASE_PATH, "") || "/" : pathname;

    return routes.find((route) => {
      // 정확히 일치하는 라우트 먼저 확인
      if (route.path === cleanPath) {
        return true;
      }

      // 동적 라우트 확인 (예: /product/:id)
      const routeParts = route.path.split("/");
      const pathParts = cleanPath.split("/");

      if (routeParts.length !== pathParts.length) {
        return false;
      }

      return routeParts.every((part, index) => {
        return part.startsWith(":") || part === pathParts[index];
      });
    });
  };

  // 라우트 파라미터 추출
  const getRouteParams = (routePath, currentPath) => {
    const routeParts = routePath.split("/");
    const pathParts = currentPath.split("?")[0].split("/");
    const params = {};

    routeParts.forEach((part, index) => {
      if (part.startsWith(":")) {
        const paramName = part.slice(1); // ':' 제거
        params[paramName] = pathParts[index];
      }
    });

    return params;
  };

  // 현재 경로 가져오기
  const getCurrentPath = () => {
    return window.location.pathname + window.location.search;
  };

  // 페이지 이동
  const navigate = (path, options = {}) => {
    let fullPath = path;

    // 쿼리 파라미터만 전달된 경우 (예: "?limit=20&page=1")
    if (path.startsWith("?")) {
      fullPath = window.location.pathname + path;
    }

    const route = findRoute(fullPath);

    if (route) {
      // URL 변경 - replace 옵션에 따라 pushState vs replaceState 선택
      if (options.replace) {
        window.history.replaceState({}, "", fullPath);
      } else {
        window.history.pushState({}, "", fullPath);
      }

      currentRoute = route;

      // 라우트 파라미터 store 업데이트
      const params = getRouteParams(route.path, fullPath);
      setRouteParams(params);

      // 컴포넌트 렌더링
      update(route.component);
    } else {
      console.error("Route not found:", fullPath);
    }
  };

  // 초기화
  const init = (onPopState) => {
    // popstate 이벤트 리스너 등록
    window.addEventListener("popstate", () => {
      if (onPopState) {
        onPopState();
      } else {
        // 기본 라우터 동작 testcode popState 이벤트 고려
        const fullPath = getCurrentPath();
        navigate(fullPath);
      }
    });
  };

  return {
    init,
    navigate,
    findRoute,
    getCurrentPath,
    getRouteParams,
    currentRoute,
  };
};

const routesConfig = [
  {
    path: "/",
    component: MainPage,
  },
  {
    path: "/product/:id",
    component: ProductDetailPage,
  },
];

export const router = createRouter(routesConfig);
