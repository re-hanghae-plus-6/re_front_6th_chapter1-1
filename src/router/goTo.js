import { getFullPath } from "../utils/pathUtils.js";

export function goTo(path) {
  const fullPath = getFullPath(path); // 배포환경 서브디렉토리 경로 처리
  window.history.pushState({}, "", fullPath);
  window.dispatchEvent(new Event("popstate"));
}
