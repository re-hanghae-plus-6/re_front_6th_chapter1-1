/**
 * 환경별 설정
 */
export const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";

/**
 * 전체 경로 생성
 * @param {string} path - 상대 경로
 * @returns {string} 전체 경로
 */
export const getFullPath = (path) => {
  return `${BASE_PATH}${path}`;
};

/**
 * 현재 경로에서 BASE_PATH 제거
 * @param {string} pathname - 현재 경로
 * @returns {string} 상대 경로
 */
export const getRelativePath = (pathname) => {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }
  return pathname;
};
