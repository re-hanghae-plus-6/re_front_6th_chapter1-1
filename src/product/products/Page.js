import { Component } from "../../core/Component";
import { Footer } from "../../shared/components/Footer";
import { Layouy } from "../../shared/components/Layout";
import { html } from "../../shared/utils/html";
import { Filters } from "./components/Filters";
import { Header } from "./components/Header";
import { Products } from "./components/Products";
import { productsStore } from "./store/products";

export function ProductsPage($root) {
  productsStore.initSearchParams();
  productsStore.loadCategories().then(() => {
    productsStore.loadProducts();
  });

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
