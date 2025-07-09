import { Component } from "../../../core/Component";
import { html } from "../../../utils/html";
import { productsStore } from "../../store/products";

export class LimitSelect extends Component {
  renderContainer() {
    return html`<div ${this.dataAttribute.attribute} class="flex items-center gap-2">
      <label class="text-sm text-gray-600">개수:</label>
      ${this.select({ initValue: productsStore.limit })}
    </div>`;
  }

  render() {
    this.$el.querySelector("#limit-select").value = productsStore.limit;
  }

  select({ initValue }) {
    return html`<select
      id="limit-select"
      class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      ${[10, 20, 50, 100]
        .map((value) => this.option({ value, name: `${value}개`, selected: value === initValue }))
        .join("")}
    </select>`;
  }

  option({ value, name, selected }) {
    return html`<option value="${value}" ${selected ? "selected" : ""}>${name}</option>`;
  }

  setEvent() {
    super.setEvent();
    this.addEvent("change", (e) => {
      if (e.target.closest("select")) {
        productsStore.setLimit(e.target.value);
      }
    });
  }
}
