import MainPage from "../../pages/Main";
import DetailPage from "../../pages/Detail";

const routes = {
  "/": MainPage,
  "/:productId": DetailPage,
};

export default routes;
