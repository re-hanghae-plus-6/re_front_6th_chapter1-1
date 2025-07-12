import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

export const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/product/:id",
    component: ProductDetailPage,
  },
  {
    path: "*",
    component: NotFoundPage,
  },
];
