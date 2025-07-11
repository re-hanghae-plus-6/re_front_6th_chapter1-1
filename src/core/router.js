const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = getAppPath();
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
    const cleanPath = path.split("?")[0];
    window.history.pushState(null, "", getFullPath(cleanPath));
    this.currentPath = cleanPath;

    this.handleRoute();
  }

  async handleRoute() {
    const path = getAppPath();
    this.currentPath = path;

    if (this.routes.has(path)) {
      await this.routes.get(path)();
      return;
    }

    const productMatch = path.match(/^\/product\/(.+)$/);
    if (productMatch && this.routes.has("/product/:id")) {
      const productId = productMatch[1];
      await this.routes.get("/product/:id")(productId);
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
