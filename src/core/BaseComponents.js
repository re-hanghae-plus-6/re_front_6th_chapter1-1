import Router from "./Router";

class BaseComponents {
  constructor() {
    this.container = document.createElement("div");
    this.router = new Router();
  }

  async template() {
    return ``;
  }

  bindEvents() {}

  async mount(parentElement) {
    const result = await this.template();
    this.container.innerHTML = result;
    if (parentElement) {
      parentElement.appendChild(this.container);
    } else {
      document.querySelector("main").appendChild(this.container);
    }
    this.bindEvents();
  }

  unMount() {}
}

export default BaseComponents;
