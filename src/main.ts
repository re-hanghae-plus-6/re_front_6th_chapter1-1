/// <reference types="vite/client" />

import { initRouter } from "./router.ts";
import { homePage } from "./pages/home.ts";
import { detailPage } from "./pages/product-detail.ts";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function bootstrap() {
  // 라우터 설정 및 초기 렌더
  initRouter({
    "/": () => {
      homePage();
    },
    "/product/:id": (params) => {
      detailPage(params as any);
    },
  });
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(bootstrap);
} else {
  // Vitest 환경에서는 즉시 실행해 테스트와 race 조건을 방지한다.
  await bootstrap();
}
