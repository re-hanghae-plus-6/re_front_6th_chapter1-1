import { createDataAttribute } from "../utils/data-attributes.js";
import { observable, observe } from "./observer.js";

export class Component {
  state;
  props;
  $el;
  #disposeObserve;

  constructor(props) {
    this.props = props;
    this.id = `${this.constructor.name}-component-${window.crypto.randomUUID()}`;
    this.dataAttribute = createDataAttribute(this.id);
    this.abortController = null;
  }

  setup() {
    this.state = observable(this.initState());
    this.#disposeObserve = observe(this.id, () => {
      this.mounted();
      this.setEvent();
      this.render();
    });
    this.#getComponentInstance().forEach((v) => v.setup());
  }

  initState() {
    return {};
  }
  /** html 템플릿 리터럴로 초기 렌더링용 */
  renderContainer() {}
  /** 상태변화시 렌더링용 */
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
    if (!this.$el) {
      throw new Error(`${this.dataAttribute.selector} not found`);
    }
  }
  #getComponentInstance() {
    const properties = Object.values(this).filter((v) => v instanceof Component);
    const props = Object.values(this.props ?? {}).filter((v) => v instanceof Object);
    return [...properties, ...props];
  }
  dispose() {
    if (this.#disposeObserve) {
      this.#disposeObserve();
    }
    this.#getComponentInstance().forEach((v) => v.dispose());
  }
}
