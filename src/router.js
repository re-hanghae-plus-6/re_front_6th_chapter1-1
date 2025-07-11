import { home } from "./pages/home.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { NotFound } from "./pages/NotFound.js";
import { addScrollListener, removeScrollListener } from "./main.js";

const routes = [
  { path: "/", component: home, isDetail: false },
  { path: "/product/:id", component: ProductDetail, isDetail: true },
];
class Router {
  constructor(initialMainStatus) {
    this.routes = routes;
    this.mainStatus = structuredClone(initialMainStatus);
    this.appRoot = document.querySelector("#root");
    this.BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "/";
    this.initEventListeners();
  }

  getAppPath(fullPath = window.location.pathname) {
    return fullPath.startsWith(this.BASE_PATH) ? fullPath.slice(this.BASE_PATH.length) || "/" : fullPath;
  }

  getFullPath(appPath) {
    return this.BASE_PATH + appPath;
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
      const regex = new RegExp(`^${this.BASE_PATH}${route.path.replace(/:\w+/g, "([^/]+)")}$`);
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
    const currentPath = window.location.pathname + window.location.search;
    const newUrl = new URL(this.getFullPath(path), window.location.origin);

    // 홈 페이지로 이동하거나, 현재 경로가 홈 페이지인 경우에만 쿼리 파라미터를 추가합니다.
    if (
      newUrl.pathname === this.BASE_PATH ||
      newUrl.pathname === this.BASE_PATH + "/" ||
      currentPath.startsWith(this.BASE_PATH + "?")
    ) {
      const currentParams = this.getCurrentState().params;
      for (const key in currentParams) {
        if (currentParams[key]) {
          newUrl.searchParams.set(key, currentParams[key]);
        } else {
          newUrl.searchParams.delete(key);
        }
      }
    }
    if (currentPath !== newUrl.pathname + newUrl.search) {
      window.history.pushState({}, "", newUrl.toString());
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
