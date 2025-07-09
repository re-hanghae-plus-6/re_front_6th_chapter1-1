import { createDataAttribute } from "../utils/data-attributes.js";
import { html } from "../utils/html.js";
import { observable, observe } from "./observer.js";

export class Component {
  state;
  props;
  $el;

  constructor(props) {
    this.props = props;
    this.name = `${this.constructor.name}-component-${window.crypto.randomUUID()}`;
    this.dataAttribute = createDataAttribute(this.name);
    this.abortController = null;
  }

  setup() {
    this.state = observable(this.initState());
    observe(() => {
      this.mounted();
      this.setEvent();
      this.render();
    });
    this.#getComponentInstance().forEach((v) => v.setup());
  }

  initState() {
    return {};
  }
  template() {}
  renderContainer() {
    return html`<div ${this.dataAttribute.attribute}></div>`;
  }
  render() {}
  setEvent() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
  }
  addEvent(eventType, callback) {
    this.$el.addEventListener(eventType, callback, this.abortController);
  }
  mounted() {
    this.$el = document.querySelector(this.dataAttribute.selector);
  }
  #getComponentInstance() {
    const properties = Object.values(this).filter((v) => v instanceof Component);
    const props = Object.values(this.props ?? {}).filter((v) => v instanceof Object);
    return [...properties, ...props];
  }
}
