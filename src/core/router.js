export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = window.location.pathname;
    this.init();
  }

  init() {
    window.addEventListener("popstate", () => {
      this.handleRoute();
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-link]");
      if (link) {
        event.preventDefault();
        const href = link.getAttribute("href") || link.getAttribute("data-href");
        if (href) {
          this.navigate(href);
        }
      }

      const anchor = event.target.closest("a[href]");
      if (anchor && !anchor.hasAttribute("target") && anchor.getAttribute("href").startsWith("/")) {
        event.preventDefault();
        this.navigate(anchor.getAttribute("href"));
      }
    });
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  navigate(path) {
    if (this.currentPath === path) return;

    window.history.pushState(null, "", path);
    this.currentPath = path;
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    this.currentPath = path;

    if (this.routes.has(path)) {
      await this.routes.get(path)();
      return;
    }

    const productMatch = path.match(/^\/products\/(.+)$/);
    if (productMatch && this.routes.has("/products/:id")) {
      const productId = productMatch[1];
      await this.routes.get("/products/:id")(productId);
      return;
    }

    if (this.routes.has("*")) {
      await this.routes.get("*")();
    }
  }

  getCurrentPath() {
    return this.currentPath;
  }

  getProductId() {
    const match = this.currentPath.match(/^\/products\/(.+)$/);
    return match ? match[1] : null;
  }
}
