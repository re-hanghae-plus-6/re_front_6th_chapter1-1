// router.js (structuredClone 적용 최종 버전)

import { home } from "./pages/home.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { NotFound } from "./pages/NotFound.js";

const routes = [
  { path: "/", component: home },
  { path: "/product/:id", component: ProductDetail },
];

class Router {
  constructor(initialMainStatus) {
    this.routes = routes;
    // structuredClone을 사용하여 상태를 깊은 복사
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
    const matchedRoute = this.routes.find((route) => {
      const regex = new RegExp(`^${route.path.replace(/:\w+/g, "([^/]+)")}$`);
      const match = path.match(regex);
      if (match) {
        const params = {};
        const paramNames = (route.path.match(/:\w+/g) || []).map((name) => name.substring(1));
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        route.params = params;
        return true;
      }
      return false;
    });

    if (matchedRoute) {
      return { component: matchedRoute.component, params: matchedRoute.params };
    }
    return { component: NotFound, params: {} };
  }

  async render() {
    const { component, params } = this._matchRoute();
    component.name === "ProductDetail" && (this.mainStatus.url = "/product/");
    // URL에서 추출한 파라미터는 urlParams 라는 이름으로 전달합니다.
    this.appRoot.innerHTML = await component({ ...this.mainStatus, urlParams: params });
  }

  navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    this.render();
  }

  updateStateAndRender(newMainStatus) {
    // 상태를 업데이트할 때도 새로운 상태를 깊은 복사
    this.mainStatus = structuredClone(newMainStatus);
    this.render();
  }

  getCurrentState() {
    return this.mainStatus;
  }
}

export const createRouter = (initialMainStatus) => {
  return new Router(initialMainStatus);
};
