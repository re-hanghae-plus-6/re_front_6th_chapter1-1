import { ProductListPage } from "./pages/ProductListPage.js";
import { registerAllEvents } from "./events.js";

export const createRenderer = (store, productService) => {
  const render = () => {
    const state = store.getState();
    const root = document.body.querySelector("#root");

    root.innerHTML = ProductListPage(state);

    // 렌더링 후 이벤트 재등록
    registerAllEvents(store, productService);
  };

  const initRenderer = () => {
    store.subscribe(render);
    render();
  };

  return { render, initRenderer };
};
