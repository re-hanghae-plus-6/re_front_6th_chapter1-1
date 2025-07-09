import { Component } from "../core/Component";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { Layouy } from "../layout/Layout";
import { html } from "../utils/html";
import { Filters } from "./components/filters/Filters";
import { Products } from "./components/products/Products";
import { productsStore } from "./store/products";

export function ProductsPage($root) {
  productsStore.initSearchParams();
  productsStore.load();

  const layout = new Layouy({
    header: new Header(),
    main: new Main({
      filters: new Filters(),
      products: new Products(),
    }),
    footer: new Footer(),
  });
  document.querySelector($root).innerHTML = html`${layout}`;
  layout.setup();

  return () => {
    layout.dispose();
  };
}

class Main extends Component {
  renderContainer() {
    return html`<main ${this.dataAttribute.attribute} class="max-w-md mx-auto px-4 py-4">
      ${this.props.filters} ${this.props.products}
    </main>`;
  }
}
