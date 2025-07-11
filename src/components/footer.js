import BaseComponent from "@/core/component";

export default class Footer extends BaseComponent {
  constructor(target, props = {}) {
    super(target, props);
  }

  template() {
    return /* html */ `
      <footer class="bg-white border-t border-gray-200 mt-auto fixed bottom-0 left-0 right-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
          <p class="text-sm mt-2">Made with ❤️ using Vanilla JavaScript</p>
        </div>
      </footer>
    `;
  }
}
