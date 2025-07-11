import { actions } from "../stores/actions.js";

export const createRouter = (store, services) => {
  const { dispatch } = store;
  const { productService } = services;

  const routes = {
    "/": "ProductList",
    "/products": "ProductList",
    "/product/:id": "ProductDetail",
    "/cart": "Cart",
  };

  const matchRoute = (currentPath) => {
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
    const currentPath = window.location.pathname;
    const route = matchRoute(currentPath);

    // 라우트 상태 업데이트
    dispatch(
      actions.setRoute({
        name: route.name,
        path: currentPath,
        params: route.params,
      }),
    );

    // 데이터 로딩 (여기서 한 번에 처리!)
    if (route.name === "ProductList") {
      await productService.loadCategories();
      await productService.loadProducts();
    } else if (route.name === "ProductDetail" && route.params.id) {
      await productService.loadProductDetail(route.params.id);
    }
  };

  const navigate = (path) => {
    window.history.pushState(null, null, path);
    updateRoute();
  };

  const init = () => {
    window.addEventListener("popstate", updateRoute);
    updateRoute();
  };

  return { navigate, init };
};
