import { actions } from "../stores/actions.js";

// GitHub Pages 배포 시 서브패스 처리
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

// 전체 경로에서 앱 경로 추출
const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

// 앱 경로에서 전체 경로 생성
const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

export const createRouter = (store, services) => {
  const { dispatch } = store;
  const { productService } = services;

  const getPath = () => getAppPath();

  const routes = {
    "/": "ProductList",
    "/products": "ProductList",
    "/product/:id": "ProductDetail",
    "/cart": "Cart",
  };

  const getTarget = () => {
    const currentPath = getPath();

    if (routes[currentPath]) {
      return { name: routes[currentPath], params: {} };
    }

    for (const [routePath, routeName] of Object.entries(routes)) {
      if (routePath.includes(":")) {
        const pathParts = routePath.split("/");
        const currentParts = currentPath.split("/");

        if (pathParts.length === currentParts.length) {
          const match = pathParts.every((part, index) => part.startsWith(":") || part === currentParts[index]);

          if (match) {
            const params = {};
            pathParts.forEach((part, index) => {
              if (part.startsWith(":")) {
                const key = part.slice(1);
                params[key] = currentParts[index];
              }
            });
            return { name: routeName, params };
          }
        }
      }
    }

    return { name: "NotFound", params: {} };
  };

  const updateRoute = async () => {
    const route = getTarget();

    // 라우트 상태 업데이트
    dispatch(
      actions.setRoute({
        name: route.name,
        path: getPath(), // 현재 경로 저장
        params: route.params,
      }),
    );

    // 데이터 로딩
    if (route.name === "ProductList") {
      await productService.loadCategories();
      await productService.loadProducts();
    } else if (route.name === "ProductDetail" && route.params.id) {
      await productService.loadProductDetail(route.params.id);
    }
  };

  const navigate = (path) => {
    // 앱 경로를 전체 경로로 변환하여 history에 추가
    const fullPath = getFullPath(path);
    window.history.pushState(null, null, fullPath);
    updateRoute();
  };

  const init = () => {
    window.addEventListener("popstate", updateRoute);
    updateRoute();
  };

  return { navigate, init, getPath, getTarget };
};
