// GitHub Pages 배포 시 서브디렉토리 경로 처리를 위한 유틸리티

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

/**
 * 전체 경로에서 앱 내부 경로를 추출
 * @param {string} fullPath - 브라우저의 전체 경로 (기본값: 현재 pathname)
 * @returns {string} 앱 내부 경로
 *
 * 예시:
 * - 개발환경: "/product/123" → "/product/123"
 * - 배포환경: "/front_6th_chapter1-1/product/123" → "/product/123"
 */
export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

/**
 * 앱 내부 경로를 전체 경로로 변환
 * @param {string} appPath - 앱 내부 경로
 * @returns {string} 전체 경로
 *
 * 예시:
 * - 개발환경: "/product/123" → "/product/123"
 * - 배포환경: "/product/123" → "/front_6th_chapter1-1/product/123"
 */
export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

/**
 * 현재 앱 경로 가져오기
 * @returns {string} 현재 앱 내부 경로
 */
export const getCurrentAppPath = () => {
  return getAppPath();
};

/**
 * 베이스 경로 가져오기
 * @returns {string} 베이스 경로
 */
export const getBasePath = () => {
  return BASE_PATH;
};
