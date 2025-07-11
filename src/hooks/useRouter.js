import Home from "../pages/Home.js";
import ProductDetail from "../pages/ProductDetail.js";
import { NotFound } from "../pages/NotFound.js";

export function useRouter(container) {
  const routeMap = {};

  const routes = [
    {
      path: "/",
      handler: (container, params) => {
        new Home(container, params);
      },
    },
    {
      path: "/product/:id",
      handler: (container, params) => {
        new ProductDetail(container, params);
      },
    },
    {
      path: "*",
      handler: (container) => {
        container.innerHTML = NotFound();
      },
    },
  ];

  const initRoutes = () => {
    routes.forEach((route) => {
      routeMap[route.path] = route.handler;
    });
  };

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = {};

    for (const [key, value] of searchParams) {
      query[key] = value;
    }

    return { query };
  };

  const findRoute = (path) => {
    if (routeMap[path]) {
      return { route: path, params: {} };
    }

    for (const routePath in routeMap) {
      if (routePath.includes(":")) {
        const routeParts = routePath.split("/");
        const pathParts = path.split("/");

        if (routeParts.length === pathParts.length) {
          const params = {};
          let isMatch = true;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
              const paramName = routeParts[i].slice(1);
              params[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              isMatch = false;
              break;
            }
          }

          if (isMatch) {
            return { route: routePath, params };
          }
        }
      }
    }

    return null;
  };

  const render = async (path) => {
    if (!path) {
      path = window.location.pathname;
    }

    const result = findRoute(path);

    if (result) {
      const component = routeMap[result.route];
      const { query } = getQueryParams();
      const params = { ...result.params, ...query };
      await component(container, params);
    } else {
      const notFoundHandler = routeMap["*"];
      await notFoundHandler(container);
    }
  };

  const navigate = (path) => {
    history.pushState(null, "", path);
    render(path);
  };

  const updateQuery = (key, value, options = {}) => {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    const newUrl = url.pathname + url.search;
    history.pushState(null, "", newUrl);

    if (options.rerender !== false) {
      render();
    }
  };

  const init = () => {
    initRoutes();

    window.addEventListener("popstate", () => {
      render(window.location.pathname);
    });

    render(window.location.pathname);
  };

  return {
    init,
    navigate,
    updateQuery,
    getQueryParams,
    render,
  };
}
