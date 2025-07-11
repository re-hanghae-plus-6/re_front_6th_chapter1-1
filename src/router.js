import { home } from "./pages/home.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { NotFound } from "./pages/NotFound.js";
import { addScrollListener, removeScrollListener } from "./main.js";

const routes = [
  { path: "/", component: home, isDetail: false },
  { path: "/product/:id", component: ProductDetail, isDetail: true },
  // { path: "/?", component: Breadcrumb, isBreadcrumb: true },
];

class Router {
  constructor(initialMainStatus) {
    this.routes = routes;
    this.mainStatus = structuredClone(initialMainStatus);
    this.appRoot = document.querySelector("#root");
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("popstate", () => this.render());
    document.addEventListener("DOMContentLoaded", () => {
      document.body.addEventListener("click", (e) => this.handleLinkClick(e));
      this.render();
    });
  }

  handleLinkClick(event) {
    const target = event.target.closest("[data-link]");
    if (target) {
      event.preventDefault();
      this.navigate(target.getAttribute("href"));
    }
  }

  _matchRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    let foundComponent = NotFound; // 기본값은 NotFound
    let extractedParams = {};
    let isDetailPage = false;

    // Extract path parameters (e.g., :id)
    for (const route of this.routes) {
      const regex = new RegExp(`^${route.path.replace(/:\w+/g, "([^/]+)")}$`);
      const match = path.match(regex);

      if (match) {
        foundComponent = route.component;
        isDetailPage = route.isDetail || false;

        const paramNames = (route.path.match(/:\w+/g) || []).map((name) => name.substring(1));
        paramNames.forEach((name, index) => {
          extractedParams[name] = match[index + 1];
        });
        break; // 일치하는 라우트를 찾았으므로 반복 중단
      }
    }

    // Extract query parameters
    for (const [key, value] of searchParams.entries()) {
      extractedParams[key] = value;
    }

    return {
      component: foundComponent,
      params: extractedParams,
      isDetail: isDetailPage,
    };
  }

  async render() {
    const { component, params, isDetail } = this._matchRoute();
    this.appRoot.innerHTML = await component({ ...this.mainStatus, urlParams: params, isDetail: isDetail });
    this.setCurrentState({ ...this.mainStatus, urlParams: params, isDetail: isDetail });
    if (window.location.pathname === "/") {
      addScrollListener();
    } else {
      removeScrollListener();
    }
  }

  navigate(path) {
    if (window.location.pathname + window.location.search !== path) {
      window.history.pushState({}, "", path);
    }
    this.render();
  }

  updateStateAndRender(newMainStatus) {
    this.mainStatus = structuredClone(newMainStatus);
    this.render();
  }

  getCurrentState() {
    return this.mainStatus;
  }

  setCurrentState(newMainStatus) {
    this.mainStatus = structuredClone(newMainStatus);
  }
}

export const createRouter = (initialMainStatus) => {
  return new Router(initialMainStatus);
};
