import { Component } from "../../core/Component";
import { router } from "../../core/router";
import { Footer } from "../../shared/components/Footer";
import { Layouy } from "../../shared/components/Layout";
import { html } from "../../shared/utils/html";
import { Header } from "./components/Header";

export function ProductDetailPage($root) {
  const layout = new Layouy({
    header: new Header(),
    main: new Main({}),
    footer: new Footer(),
  });
  document.querySelector($root).innerHTML = html`${layout}`;
  layout.setup();
  console.log(router.getParams());

  return () => {
    layout.dispose();
  };
}

class Main extends Component {
  renderContainer() {
    return html`<main ${this.dataAttribute.attribute} class="max-w-md mx-auto px-4 py-4"></main>`;
  }
}
