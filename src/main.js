import { initRootRenderer, update } from "./core/renderer.js";
import { router } from "./core/router.js";
import { NotFoundPage } from "./pages/NotFoundPage/NotFounPage.js";
import { initEventListeners } from "./utils/events.js";
import { setRouteParams, setSearchParams } from "./utils/store.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

// let isMainRunning = false;

// 라우트 정의

export async function main() {
  // if (isMainRunning) {
  //   return;
  // }

  // isMainRunning = true;

  // 공통 초기화
  initRootRenderer();
  initEventListeners();
  router.init(main);

  // page 파라미터 정리
  const searchParams = new URLSearchParams(window.location.search);
  setSearchParams(searchParams);

  if (searchParams.has("page")) {
    searchParams.delete("page");
    setSearchParams(searchParams);
    router.navigate(`?${searchParams.toString()}`, { replace: true });
  }

  const currentPath = router.getCurrentPath();
  const route = router.findRoute(currentPath);

  if (route) {
    // 라우트 파라미터를 store에 저장
    const params = router.getRouteParams(route.path, currentPath);

    setRouteParams(params);

    // 먼저 navigate로 즉시 렌더링
    router.navigate(currentPath, { replace: true });

    // 그 다음 onMount 호출
    if (route.component.onMount) {
      await route.component.onMount();
    }
  } else {
    update(NotFoundPage);
  }

  // isMainRunning = false;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
