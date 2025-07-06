class View {
  #container;
  #view;

  constructor({ view, container = document.body }) {
    this.#view = view;
    this.#container = container;
  }

  getContainer() {
    return this.#container;
  }

  setContainer(container) {
    this.#container = container;
  }

  getView() {
    return this.#view;
  }

  render() {
    this.#container.innerHTML = this.#view;
  }
}

export { View };
