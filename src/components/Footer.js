class Footer {
  constructor() {
    this.el = null;
  }

  template() {
    return `
      <footer class="bg-white shadow-sm">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    `;
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template().trim();
    this.el = template.content.firstElementChild;
    return this.el;
  }
}

export default Footer;
