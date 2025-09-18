import Home from "./pages/Home.js";
import Product from "./pages/Product.js";
import { router } from "./router/Router.js";

const routes = [
  { path: "/", component: Home },
  { path: "/product/:id", component: Product },
];
routes.forEach(route => {
  router.addRoute(route.path, route.component);
});

export const render = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  const target = router.target;
  rootElement.innerHTML = target();
};

export const initRender = () => {
  router.subscribe(render);
};
