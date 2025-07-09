class Component {
  constructor(element, props) {
    this.element = element;
    this.props = props;
    this.state = {};
    this.mounted = false;
    this.eventListeners = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.mounted) {
      this.render();
    }
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  mount() {
    this.mounted = true;
    this.onMount();
    this.render();
    this.attachEventListeners();
  }

  unmount() {
    this.mounted = false;
    this.onUnmount();

    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  onMount() {}
  onUnmount() {}
  render() {}
  attachEventListeners() {}
}

export default Component;
