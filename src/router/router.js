import Home from "../pages/Home.js";
import ProductPage from "../pages/ProductPage.js";
import NotFound from "../pages/NotFount.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

export const Router = () => {
  const routes = { "/": Home, "/product/:id": ProductPage, "/404": NotFound() };

  // 라우트 추가 함수
  function addRoute(path, component) {
    routes[path] = component;
  }

  // 경로를 정규식으로 변환하는 함수
  const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

  const matchRoute = (path) => {
    if (routes[path]) {
      return { component: routes[path], params: {} };
    }
    for (const [route, component] of Object.entries(routes)) {
      if (route.includes(":")) {
        const regex = pathToRegex(route);
        const match = path.match(regex);
        if (match) {
          const paramsName = route.match(/:\w+/g)?.map((param) => param.slice(1)) || [];
          const params = {};

          paramsName.forEach((param, index) => {
            params[param] = match[index + 1];
          });

          return { component, params };
        }
      }
    }

    return { component: routes["/404"], params: {} };
  };

  // 경로에서 BASE_PATH를 제거하는 함수
  const removeBasePath = (path) => {
    if (BASE_PATH && path.startsWith(BASE_PATH)) {
      return path.slice(BASE_PATH.length) || "/";
    }
    return path;
  };

  // 경로에 BASE_PATH를 추가하는 함수
  const addBasePath = (path) => {
    return BASE_PATH + path;
  };

  function render(path) {
    const { component, params } = matchRoute(path);

    let componentInstance;
    if (typeof component === "function" && !component.render) {
      componentInstance = component();
    } else {
      componentInstance = component;
    }
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = componentInstance.render(params);

      if (componentInstance.setup) {
        componentInstance.setup(params);
      }
    }
  }

  // 페이지 이동 함수 (pushState 포함)
  function navigate(path) {
    const currentPath = new URL(window.location);
    const queryParams = currentPath.search;

    const fullPath = addBasePath(path) + queryParams;
    window.history.pushState({}, "", fullPath);

    render(path);
  }
  function init() {
    window.addEventListener("popstate", () => {
      const currentPath = removeBasePath(window.location.pathname);
      render(currentPath);
    });

    const checkAndRender = () => {
      const root = document.getElementById("root");
      if (root && root.children.length === 0) {
        const currentPath = removeBasePath(window.location.pathname);
        render(currentPath);
      }
    };

    if (import.meta.env.MODE === "test") {
      setInterval(checkAndRender, 10);
    }
    const currentPath = removeBasePath(window.location.pathname);
    render(currentPath);
  }

  return {
    addRoute,
    init,
    navigate,
  };
};
