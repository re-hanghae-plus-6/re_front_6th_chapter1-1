import { Component } from "../../../core/Component";
import { html } from "../../../utils/html";
import { ProductsLoading } from "./ProductsLoading";

export class Products extends Component {
  #productsLoading = new ProductsLoading();

  renderContainer() {
    return html`<div ${this.dataAttribute.attribute}>${this.#productsLoading}</div>`;
  }
}
