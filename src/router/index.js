import { routes } from "./routes.js";
import { getAppPath } from "../utils/pathUtils.js";

// GitHub Pages 배포 환경을 고려한 라우터

export function router() {
  const appPath = getAppPath(); // 배포환경 서브디렉토리 경로 처리
  const isProductDetailPage = /^\/product\/\d+$/.test(appPath);

  // 상세 페이지 진입 시 렌더링 비활성화
  if (isProductDetailPage && window.disableRendering) {
    window.disableRendering();
  }

  for (const route of routes) {
    const match = appPath.match(route.path);
    if (match) {
      route.action(match);
      return;
    }
  }
}
