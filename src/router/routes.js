import Home from "../pages/Home.js";
import ProductDetail from "../pages/ProductDetail.js";
import { NotFound } from "../pages/NotFound.js";

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

export default routes;
