import Home from "../pages/Home.js";
import ProductPage from "../pages/ProductPage.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

export const Router = () => {
  const routes = { "/": Home, "/product/:id": ProductPage };

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

          console.log(params, component);
          return { component, params };
        }
      }
    }

    return { component: routes["/"], params: {} };
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

  // 페이지 이동 함수
  function navigate(path) {
    const fullPath = addBasePath(path);
    window.history.pushState({}, "", fullPath);

    const { component, params } = matchRoute(path);

    let componentInstance;
    // 함수형 컴포넌트인지 확인
    if (typeof component === "function" && !component.render) {
      componentInstance = component();
    } else {
      componentInstance = component;
    }
    document.getElementById("root").innerHTML = componentInstance.render(params);

    if (componentInstance.setup) {
      componentInstance.setup(params);
    }
  }

  function init() {
    window.addEventListener("popstate", () => {
      const currentPath = removeBasePath(window.location.pathname);
      navigate(currentPath);
    });
    const currentPath = removeBasePath(window.location.pathname);
    navigate(currentPath);
  }

  return {
    addRoute,
    init,
    navigate,
  };
};
