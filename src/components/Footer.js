const Footer = {
  el: null,

  // 👉 템플릿 문자열
  template() {
    return `
      <footer class="bg-white shadow-sm">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    `;
  },

  // 👉 렌더링
  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template().trim();
    const node = template.content.firstElementChild;

    if (!node) {
      console.error("Footer: 렌더링 실패 - 유효한 DOM이 없음");
      return document.createTextNode("");
    }

    this.el = node;
    return this.el;
  },

  // 👉 초기화
  init() {
    const el = this.render();
    return el;
  },
};

export default Footer;
