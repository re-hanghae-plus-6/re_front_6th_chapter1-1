import { renderLoadingContent, renderNotFound } from "./handler";

export const routes = {
  "/": renderLoadingContent,
  // "/products": renderProducts,
};

export const defaultRoute = renderNotFound;
