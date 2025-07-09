import { HomePage } from "./pages/HomePage.js";
import { ProjectDetailPage } from "./pages/ProjectDetailPage.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

window.addEventListener("popstate", router);
window.addEventListener("hashchange", router);

export async function router() {
  const [, route, id] = location.pathname.split("/");

  if (route === "product" && id) {
    console.log("project detail page");
    return await ProjectDetailPage(id);
  } else {
    return await HomePage();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(router);
} else {
  router();
}
