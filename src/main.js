import { BASE_PATH } from "./config/path.js";
import { DetailPage } from "./pages/DetailPage.js";
import { ListPage } from "./pages/ListPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
// import { renderViewComponent } from "./utils/createViewcomponent.js";
import { onChangeUrl } from "./utils/urlUtils.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

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
      // 접두사 BASE_PATH를 동적으로 붙임, $는 경로 끝 표시
      matchPattern: `^${BASE_PATH}/$`,
    },
    {
      pathname: "/product/:productId",
      component: DetailPage,
      matchPattern: `^${BASE_PATH}/product/[A-Za-z0-9_-]+$`,
    },
    {
      pathname: "*",
      component: NotFoundPage,
      matchPattern: `^${BASE_PATH}.*$`,
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

  onChangeUrl.onChange(() => {
    // a.updateComponent(getMatchedRouteComponent()).render();
    const res = getMatchedRouteComponent()();
    console.log(res);
  });

  // const a = renderViewComponent({
  //   parent: window.document.body,
  //   component: getMatchedRouteComponent(),
  // });
  // a.render();
  const a = getMatchedRouteComponent()();
  console.log(a);
  // ListPage();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
