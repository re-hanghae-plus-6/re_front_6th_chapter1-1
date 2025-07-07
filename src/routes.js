import Product from "./pages/Product";
import Products from "./pages/Products";
import { Router } from "./utils/router";

const routes = {
  path: "/",
  view: () => Products(),
  children: [
    {
      path: "/product/:productId",
      view: () => Product(),
    },
  ],
};

export const router = new Router(routes);
