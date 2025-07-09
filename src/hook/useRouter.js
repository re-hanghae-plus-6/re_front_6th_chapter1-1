import { Router } from "../lib/Router";

/**
 * 현재 경로의 동적 파라미터를 반환하는 훅
 * 예: /product/:id 경로에서 /product/123 접속 시 { id: "123" } 반환
 * @returns {Object} 경로 파라미터 객체
 */
export function useParams() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useParams: Router instance not found");
    return {};
  }

  return router.getParams();
}

/**
 * 특정 경로 파라미터 값을 반환하는 훅
 * @param {string} key - 파라미터 키
 * @returns {string|undefined} 파라미터 값
 */
export function useParam(key) {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useParam: Router instance not found");
    return undefined;
  }

  return router.getParams(key);
}

/**
 * 현재 URL의 쿼리 파라미터를 반환하는 훅
 * 예: /products?category=electronics&page=2 접속 시 { category: "electronics", page: "2" } 반환
 * @returns {Object} 쿼리 파라미터 객체
 */
export function useSearchParams() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useSearchParams: Router instance not found");
    return {};
  }

  return router.getQueryParams();
}

/**
 * 특정 쿼리 파라미터 값을 반환하는 훅
 * @param {string} key - 쿼리 파라미터 키
 * @returns {string|undefined} 쿼리 파라미터 값
 */
export function useSearchParam(key) {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useSearchParam: Router instance not found");
    return undefined;
  }

  return router.getQueryParams(key);
}

/**
 * 프로그래밍 방식으로 네비게이션하는 훅
 * @returns {Object} navigate 함수와 현재 경로 정보를 포함한 객체
 */
export function useNavigate() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useNavigate: Router instance not found");
    return {
      navigate: () => {},
      currentPath: "",
    };
  }

  return {
    navigate: (to, replace = false) => router.navigate(to, replace),
    currentPath: router.getCurrentPath(),
  };
}
