import { ProductListPage } from "./pages/productListPage.js";
import { ProductDetailPage } from "./pages/productDetailPage.js";
import { NotFoundPage } from "./pages/notFoundPage.js";

export const ROUTES = {
  HOME: {
    path: "/",
    component: ProductListPage,
    headerType: "main",
    loadingAction: () => ({
      loading: true,
      loadingCategories: true,
      error: null,
      categoriesError: null,
    }),
  },
  PRODUCT_DETAIL: {
    path: "/product/:id",
    component: ProductDetailPage,
    headerType: "detail",
    loadingAction: () => ({
      productDetail: {
        loading: true,
        error: null,
      },
    }),
  },
  NOT_FOUND: {
    path: "*",
    component: NotFoundPage,
    headerType: "main",
    loadingAction: null,
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
