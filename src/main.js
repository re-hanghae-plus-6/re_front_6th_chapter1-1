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

window.addEventListener("load", () => {
  router();
});

export async function router() {
  const [, route] = location.pathname.split("/");

  if (route === "product") {
    return await ProjectDetailPage();
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
