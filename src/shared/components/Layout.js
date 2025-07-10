import { Component } from "../../core/Component";
import { html } from "../utils/html";

export class Layouy extends Component {
  renderContainer() {
    const { header, main, footer } = this.props;
    return html` <div ${this.dataAttribute.attribute} class="min-h-screen bg-gray-50">
      ${header} ${main} ${footer}
    </div>`;
  }
}
