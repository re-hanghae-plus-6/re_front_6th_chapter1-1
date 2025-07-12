import { pathToRegex } from "./js/utils";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";

const routes = [
  {
    path: pathToRegex("/"),
    component: Home,
  },
  {
    path: pathToRegex("/product/:productId"),
    component: Product,
  },
  {
    path: pathToRegex("*"),
    component: NotFound,
  },
];

export default routes;
