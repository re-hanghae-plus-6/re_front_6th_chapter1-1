import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

import { SearchFilter } from "../components/SearchFilter.js";
import { createElementByString, renderViewComponent } from "../utils/createViewcomponent.js";
import createReactiveState from "../utils/reactiveState.js";
import navigateTo, { onChangeUrl } from "../utils/urlUtils.js";
import { ProductGrid } from "../components/ProductGrid.js";
import { getProducts } from "../api/productApi.js";

//container
export function ListPage() {
  const state = createReactiveState({
    isLoading: false,
    isError: false,
    isSuccess: false,
    res: null,
  });
  const renderer = renderViewComponent({
    parent: window.document.body,
    component: ListPageView,
  });

  (async function init() {
    try {
      const res = await getProducts();

      renderer.render(res.products, 0);
      parent.addEventListener("click", (e) => {
        e.preventDefault();

        navigateTo("/product/1234");
      });
    } catch (e) {
      // 토스트를 띄우시웅
    }
  })();

  renderer.render();
}

export function ListPageView(products, cartItemLength) {
  const el = createElementByString(`
    <div class="bg-gray-50 min-h-screen">
      ${Header(cartItemLength)}
      <main class="max-w-md mx-auto px-4 py-4">
        ${SearchFilter()}
        ${ProductGrid(products)}
      </main>
      ${Footer()}
    </div>
  `);

  return el;
}
