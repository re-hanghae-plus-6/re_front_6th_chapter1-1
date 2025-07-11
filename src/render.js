import { ProductListPage } from "./pages/ProductListPage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { registerAllEvents } from "./events.js";

export const createRenderer = (store, productService, router) => {
  const render = () => {
    const state = store.getState();
    const root = document.body.querySelector("#root");

    // 라우트별 페이지 분기
    switch (state.route.name) {
      case "ProductDetail":
        root.innerHTML = ProductDetailPage({
          product: state.productDetail,
          loading: state.productDetailLoading,
          relatedProducts: [],
          cart: state.cart,
        });
        break;
      case "Cart":
        root.innerHTML = "<div>장바구니 페이지 (준비중)</div>";
        break;
      case "NotFound":
        root.innerHTML = NotFoundPage(state);
        break;
      default:
        root.innerHTML = ProductListPage({
          ...state,
          cart: state.cart,
        });
    }

    registerAllEvents(store, productService, router);
  };

  const initRenderer = () => {
    store.subscribe(render);
    render();
  };

  return { render, initRenderer };
};
