import { Home } from "../pages/Home.js";
import { ProductDetail } from "../pages/ProductDetail.js";
import { NotFound } from "../pages/NotFound.js";

const routes = [
  {
    path: "/",
    component: Home,
    handler: (container) => {
      const homeHTML = Home({
        products: [],
        categories: [],
        totalCount: 0,
        isLoading: false,
      });
      container.innerHTML = homeHTML;
    },
  },
  {
    path: "/product/:id",
    component: ProductDetail,
    handler: (container, params) => {
      const productDetailHTML = ProductDetail({
        product: null,
        isLoading: false,
      });
      container.innerHTML = productDetailHTML;
      console.log(`상품 ID: ${params.id} 로딩 중...`);
    },
  },
  {
    path: "*",
    component: NotFound,
    handler: (container) => {
      const notFoundHTML = NotFound();
      container.innerHTML = notFoundHTML;
    },
  },
];

export default routes;
