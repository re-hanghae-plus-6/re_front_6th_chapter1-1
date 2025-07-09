import { Component } from "../../../core/Component";
import { html } from "../../../utils/html";
import { ProductsLoading } from "./ProductsLoading";

export class Products extends Component {
  #productsLoading = new ProductsLoading();

  setup() {
    super.setup();
  }

  renderContainer() {
    return html`${this.#productsLoading}`;
  }
}
