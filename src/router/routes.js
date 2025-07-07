import { HomeController } from "../controllers/HomeController.js";
import { ProductDetailController } from "../controllers/ProductDetailController.js";
import { NotFound } from "../pages/NotFound.js";

const routes = [
  {
    path: "/",
    handler: async (container) => {
      const homeController = new HomeController(container);
      await homeController.render();
    },
  },
  {
    path: "/product/:id",
    handler: async (container, params) => {
      const productDetailController = new ProductDetailController(container, params);
      await productDetailController.render();
    },
  },
  {
    path: "*",
    handler: (container) => {
      const notFoundHTML = NotFound();
      container.innerHTML = notFoundHTML;
    },
  },
];

export default routes;
