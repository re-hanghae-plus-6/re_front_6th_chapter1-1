import Home from "../pages/Home.js";
import ProductPage from "../pages/ProductPage.js";

export const Router = () => {
  const routes = { "/": Home, "/product/:id": ProductPage };

  // 라우트 추가 함수
  function addRoute(path, component) {
    routes[path] = component;
  }

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

          console.log(paramsName);
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

  // 페이지 이동 함수
  function navigate(path) {
    window.history.pushState({}, "", path);

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
  // 매칭 함수

  function init() {
    window.addEventListener("popstate", () => {
      navigate(window.location.pathname);
    });
    navigate(window.location.pathname);
  }

  return {
    addRoute,
    init,
    navigate,
  };
};
