import { DetailPage } from "./pages/DetailPage.js";
import { ListPage } from "./pages/ListPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { renderViewComponent } from "./utils/createViewcomponent.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  /**TODO :: 규칙에 따라 matchPattern을 만들어내는 함수 추출 */
  // const getMatchPattern = (pattern) => {
  //   // :이 붙어있을 경우
  //   if (pattern.match(/\/:[a-zA-Z0-9-_]+(\/){0,1}/)) {
  //     return pattern.replaceAll(/\/:[a-zA-Z0-9-_]+(\/){0,1}/g, "/[a-zA-Z0-9-_]+/");
  //   }

  //   // *이 있을 경우
  //   if (pattern.match(/\*/)) {
  //     return pattern.replaceAll(/\*/g, "\\S+");
  //   }

  //   return pattern;
  // };
  const routers = [
    {
      pathname: "/",
      component: ListPage,
      // matchPattern: /^\/$/,
      matchPattern: "^/$",
    },
    {
      pathname: "/product/:productId",
      component: DetailPage,
      // matchPattern: getMatchPattern("/product/:productId"),
      matchPattern: "^/product/[A-Za-z0-9_-]+$",
    },
    {
      pathname: "*",
      component: NotFoundPage,
      // matchPattern: getMatchPattern("*"),
      matchPattern: "^.*$",
    },
  ];

  const getMatchedRouteComponent = () => {
    const pathname = location.pathname;

    const matched = routers.find((route) => {
      const pattern = new RegExp(route.matchPattern);

      return pattern.test(pathname);
    });

    return matched ? matched.component : null;
  };

  console.log("getMatchedRoute()", getMatchedRouteComponent());

  renderViewComponent({ parent: window.document.body, component: getMatchedRouteComponent() }).render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
