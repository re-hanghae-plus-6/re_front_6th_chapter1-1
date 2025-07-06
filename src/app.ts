// 애플리케이션 실제 엔트리 (TypeScript)
// 앞으로 모든 SPA 초기화 코드를 여기에 작성합니다.

import { initRouter } from "./router.ts";
import { homePage } from "./pages/home.ts";
import { detailPage } from "./pages/product-detail.ts";

// 라우터 설정
initRouter({
  "/": () => {
    homePage();
  },
  "/product/:id": (params) => {
    detailPage(params as any);
  },
});

// 앱 초기 메시지는 라우터가 렌더링합니다.
