import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { vi, afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";

let AppComponent;
let router;

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

configure({
  asyncUtilTimeout: 5000,
});

beforeAll(async () => {
  server.listen({ onUnhandledRequest: "error" });

  const appModule = await import("./app.js");
  AppComponent = appModule.default;

  // 라우터도 미리 로드
  const routerModule = await import("./core/router.js");
  router = routerModule.router;
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  // 각 테스트 전에 앱을 새로 초기화
  document.body.innerHTML = '<div id="root"></div>';

  // 앱 컴포넌트 초기화
  const $root = document.querySelector("#root");
  new AppComponent($root);

  // 라우팅 실행
  goTo("/");

  // 수동으로 라우터 호출
  router();
});

afterEach(() => {
  // 각 테스트 후 상태 초기화
  document.getElementById("root").innerHTML = "";
  localStorage.clear();
});

const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = vi.fn().mockImplementation(intersectionObserverMock);
HTMLAnchorElement.prototype.click = vi.fn();
