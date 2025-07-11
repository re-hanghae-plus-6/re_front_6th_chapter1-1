// GitHub Actions / GitHub Pages 배포용 BASE_PATH 설정
const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

/**
 * 전체 경로에서 앱 경로만 추출 (BASE_PATH 제거)
 * @param {string} fullPath - 전체 경로 (기본값: 현재 pathname)
 * @returns {string} - 앱 경로 (BASE_PATH가 제거된 경로)
 */
export const getAppPath = (fullPath = window.location.pathname) => {
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length) || "/" : fullPath;
};

/**
 * 앱 경로를 전체 경로로 변환 (BASE_PATH 추가)
 * @param {string} appPath - 앱 경로
 * @returns {string} - 전체 경로 (BASE_PATH가 포함된 경로)
 */
export const getFullPath = (appPath) => {
  return BASE_PATH + appPath;
};

/**
 * BASE_PATH 값 반환
 * @returns {string} - BASE_PATH
 */
export const getBasePath = () => {
  return BASE_PATH;
};
