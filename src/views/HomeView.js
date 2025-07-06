import BaseView from "../core/BaseView";

class HomeView extends BaseView {
  constructor() {
    super();
  }

  async template() {
    return /* html */ `
      <h1>메인페이지입니다</h1>
    `;
  }

  bindEvents() {}

  unmount() {}
}

export default HomeView;
