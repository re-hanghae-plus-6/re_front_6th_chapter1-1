import { HomePage } from "./pages/HomePage.js";
import { _404_ } from "./pages/NotFoundPage.js";
import { ProjectDetailPage } from "./pages/ProjectDetailPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

window.addEventListener("popstate", router);
window.addEventListener("hashchange", router);

export function router() {
  const [, route, id] = location.pathname.replace("/front_6th_chapter1-1", "").split("/");

  if (route === "product" && id) {
    console.log("project detail page");
    return ProjectDetailPage(id);
  }

  if (!route) {
    return HomePage();
  }

  document.body.querySelector("#root").innerHTML = _404_();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(router);
} else {
  router();
}
