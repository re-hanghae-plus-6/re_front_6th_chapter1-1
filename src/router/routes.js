import { renderMainPage } from "../pages/MainPage.js";
import { renderProductDetailPage } from "../pages/ProductDetailPage.js";
import { renderNotFoundPage } from "../pages/NotFoundPage.js";

export const routes = [
  {
    path: /^\/$/,
    action: () => renderMainPage(),
  },
  {
    path: /^\/product\/(\d+)$/,
    action: (match) => renderProductDetailPage(match[1]),
  },
  {
    path: /.*/,
    action: () => renderNotFoundPage(),
  },
];
