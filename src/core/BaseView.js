class BaseView {
  constructor() {
    // main 태그 안에 template 렌더링

    this.container = document.createElement("div");
  }

  // api 호출과 html 템플릿을 담음
  async template() {
    return ``;
  }

  // 각종 이벤트 처리
  bindEvents() {}

  // this.template을 render
  async mount(parentElement = document.querySelector("main")) {
    const result = await this.template(); // return한 html 문자열 받기
    this.container.innerHTML = result;

    parentElement.appendChild(this.container);
  }

  // 페이지 이탈
  unMount() {
    this.container.remove();
  }
}

export default BaseView;
