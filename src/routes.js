import Home from "./pages/Home.js";
import ProductPage from "./pages/ProductPage.js";

const routes = {
  "/": Home,
  "/product/:id": ProductPage,
};
export default routes;
