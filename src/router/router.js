// router.js
import Home from "../pages/Home";
import ProductPage from "../pages/ProductPage";

export const Router = () => {
  const routes = {
    "/": Home,
    "/product/:id": ProductPage,
  };

  const matchRoute = (path) => {
    // 정확한 매치 먼저 확인
    if (routes[path]) {
      return { component: routes[path], params: {} };
    }

    // 동적 라우트 매칭
    for (const [route, component] of Object.entries(routes)) {
      if (route.includes(":")) {
        const regexPattern = "^" + route.replace(/:\w+/g, "([^/]+)") + "$";
        const regex = new RegExp(regexPattern);
        const match = path.match(regex);

        if (match) {
          const paramNames = route.match(/:(\w+)/g)?.map((p) => p.slice(1)) || [];
          const params = {};
          paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
          });

          return { component, params };
        }
      }
    }

    return { component: routes["/"], params: {} };
  };

  function navigate(path) {
    window.history.pushState({}, "", path);

    const { component, params } = matchRoute(path);

    if (!component) {
      console.error("❌ 컴포넌트를 찾을 수 없습니다:", path);
      return;
    }

    // 함수형 컴포넌트인지 확인
    let componentInstance;
    if (typeof component === "function" && !component.render) {
      // ProductPage() 같은 함수형 컴포넌트
      componentInstance = component();
    } else {
      // Home 같은 객체형 컴포넌트
      componentInstance = component;
    }

    // 렌더링
    document.getElementById("root").innerHTML = componentInstance.render(params);

    // setup 호출
    if (componentInstance.setup) {
      componentInstance.setup(params);
    }
  }

  function init() {
    window.addEventListener("popstate", () => {
      navigate(window.location.pathname);
    });
    navigate(window.location.pathname); // 초기 로드
  }

  return { init, navigate };
};
