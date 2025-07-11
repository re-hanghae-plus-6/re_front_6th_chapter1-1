import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

import { SearchFilter } from "../components/SearchFilter.js";
import { createElementByString, renderViewComponent } from "../utils/createViewcomponent.js";
// import createReactiveState from "../utils/reactiveState.js";
import navigateTo from "../utils/urlUtils.js";
import { ProductGrid } from "../components/ProductGrid.js";
import { getCategories, getProducts } from "../api/productApi.js";

//container
export function ListPage() {
  const renderer = renderViewComponent({
    parent: window.document.body,
    component: ListPageView,
  });

  (async function init() {
    try {
      renderer.render({});
      parent.addEventListener("click", (e) => {
        e.preventDefault();

        navigateTo("/product/1234");
      });

      const res = await getProducts();
      const categories = await getCategories();

      renderer.render({ products: res.products, categories: Object.keys(categories) });
    } catch (e) {
      console.error(e);
      // 토스트를 띄우시웅
    }
  })();

  renderer.render();
}

export function ListPageView({ products, categories, cartItemNum = 0 }) {
  console.log(":", products, categories);
  const el = createElementByString(`
    <div class="bg-gray-50 min-h-screen">
      ${Header(cartItemNum)}
      <main class="max-w-md mx-auto px-4 py-4">
        ${SearchFilter(categories)}
        ${ProductGrid(products)}
      </main>
      ${Footer()}
    </div>
  `);

  return el;
}
