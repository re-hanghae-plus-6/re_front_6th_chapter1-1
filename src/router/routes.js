import { HomeController } from "../controllers/HomeController.js";
import { ProductDetailController } from "../controllers/ProductDetailController.js";
import { NotFound } from "../pages/NotFound.js";

const routes = [
  {
    path: "/",
    handler: async (container, params) => {
      const homeController = new HomeController(container);
      await homeController.render(params);
    },
  },
  {
    path: "/product/:id",
    handler: async (container, params) => {
      const productDetailController = new ProductDetailController(container);
      await productDetailController.render(params);
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
