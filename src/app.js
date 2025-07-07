import { createRouter, setupRouter } from "./core/router";
import HomePage from "./page/HomePage";
import ProductDetailPage from "./page/ProductDetailPage";
import NotFoundPage from "./page/NotFoundPage";

export default function App() {
  const routes = [
    { path: "/", component: HomePage },
    { path: "/product/:id", component: ProductDetailPage },
    { path: "/404", component: NotFoundPage },
  ];

  const router = createRouter();
  router.addRoutes(routes);
  setupRouter(router);

  router.subscribe(({ route, params, data }) => {
    if (route && route.component) {
      route.component({ ...params, ...data });
    }
  });
  router.init();

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (link) {
      e.preventDefault();
      window.navigateTo(link.getAttribute("href"));
    }
  });
}
