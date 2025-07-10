import { ProductListPage } from "./pages/productListPage.js";
import { ProductDetailPage } from "./pages/productDetailPage.js";
import { NotFoundPage } from "./pages/notFoundPage.js";

export const ROUTES = {
  HOME: {
    path: "/",
    component: ProductListPage,
    headerType: "main",
  },
  PRODUCT_DETAIL: {
    path: "/product/:id",
    component: ProductDetailPage,
    headerType: "detail",
  },
  NOT_FOUND: {
    path: "*",
    component: NotFoundPage,
    headerType: "main",
  },
};

export const getRouteConfig = (currentRoute) => {
  if (currentRoute === "/" || !currentRoute) {
    return ROUTES.HOME;
  }

  if (currentRoute.startsWith("/product/")) {
    return ROUTES.PRODUCT_DETAIL;
  }

  return ROUTES.NOT_FOUND;
};
