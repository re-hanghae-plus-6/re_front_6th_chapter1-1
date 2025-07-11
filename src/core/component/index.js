class Component {
  constructor({ target, props = {} }) {
    this.$target = target;
    this.props = props;
    this.state = {};
    /** key: instance */
    this.childrenInstance = new Map();
    /** key: {component, props} */
    this.children = {};
    this.setup();
    this.render();
  }

  setup() {}

  template() {
    return "";
  }

  render() {
    this.$target.innerHTML = this.template();
    this.mountChildren();
    this.setEvent();
  }

  setEvent() {}

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  createBoxlessContainer(name) {
    return `<div data-component=${name} style='display: contents;'></div>`;
  }

  mountChildren() {
    Object.entries(this.children).forEach(([name, config]) => {
      const target = this.$target.querySelector(`[data-component="${name}"]`);

      if (!target) return;

      const ChildrenClass = config.component;
      const props = config.props || {};

      const prevInstance = this.childrenInstance.get(name);

      if (prevInstance) {
        prevInstance.$target = target;
        prevInstance.props = props;
        prevInstance.render();
      } else {
        const instance = new ChildrenClass({ target, props });
        this.childrenInstance.set(name, instance);
      }
    });
  }
}

export default Component;
