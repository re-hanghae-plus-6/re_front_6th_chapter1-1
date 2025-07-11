/// <reference types="vite/client" />

import { initRouter } from "./router.ts";
import { homePage } from "./pages/home.ts";
import { detailPage } from "./pages/product-detail.ts";
import { notFoundPage } from "./pages/not-found.ts";
import { bindCartBadge } from "./utils/bindCartBadge.ts";

const enableMocking = () => {
  const base = import.meta.env.BASE_URL;
  return import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      serviceWorker: { url: `${base}mockServiceWorker.js` },
      onUnhandledRequest: "bypass",
    }),
  );
};

async function bootstrap() {
  // 헤더 장바구니 배지는 전역에서 사용되기때문에 라우터 초기화와 함께바인딩
  bindCartBadge();
  // 라우터 설정 및 초기 렌더
  initRouter({
    "/": homePage,
    "/product/:id": detailPage,
    "/404": notFoundPage,
  });
}

if (import.meta.env.MODE !== "test") {
  enableMocking().then(bootstrap);
} else {
  // Vitest 환경에서는 즉시 실행해 테스트와 race 조건을 방지한다.
  await bootstrap();
}
