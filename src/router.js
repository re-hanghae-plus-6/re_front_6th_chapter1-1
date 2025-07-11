import Home from "./pages/Home.js";
import Detail from "./pages/Detail.js";
import NotFound from "./pages/NotFound.js";
import { getQueryParams } from "./utils/urlParam.js";
import { productStore } from "./store/productStore.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

const routes = {
  "/": Home,
  "/product/:productId": Detail,
  "*": NotFound,
};

let currentCleanup = null;

export function router() {
  const path = getAppPath();
  const query = getQueryParams();

  // store 상태 동기화
  if (path === "/") {
    productStore.setSearch(query.search);
    productStore.setLimit(query.limit);
    productStore.setSort(query.sort);
    productStore.setCategory1(query.category1);
    productStore.setCategory2(query.category2);
    productStore.setPage(1);
    productStore.setHasMore(true);
  }

  let route = routes[path];
  let params = {};

  if (!route) {
    const productMatch = path.match(/^\/product\/(.+)$/);
    if (productMatch) {
      route = routes["/product/:productId"];
      params = { productId: productMatch[1] };
    } else {
      route = routes["*"];
    }
  }

  const component = route(params);
  const root = document.getElementById("root");
  if (!root) return;

  if (typeof currentCleanup === "function") {
    currentCleanup();
    currentCleanup = null;
  }

  if (component && component.template && component.mount) {
    root.innerHTML = component.template;
    const cleanupResult = component.mount();
    if (cleanupResult instanceof Promise) {
      cleanupResult.then((fn) => {
        if (typeof fn === "function") currentCleanup = fn;
        else currentCleanup = null;
      });
    } else {
      currentCleanup = cleanupResult;
    }
  } else {
    root.innerHTML = component;
  }
}
