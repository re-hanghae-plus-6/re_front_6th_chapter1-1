// 전역 store 레지스트리
const stores = new Map();

/**
 * React useState 스타일의 간단한 state 생성
 * @param {string} key - state의 고유 키
 * @param {any} initialValue - 초기값
 * @returns {[getter, setter]} - [현재값 getter, 값 변경 setter]
 */
export const createState = (key, initialValue) => {
  // 이미 존재하는 state면 기존 것을 반환
  if (!stores.has(key)) {
    stores.set(key, initialValue);
  }

  const getter = () => stores.get(key);

  const setter = (newValue) => {
    const currentValue = stores.get(key);
    const nextValue = typeof newValue === "function" ? newValue(currentValue) : newValue;
    stores.set(key, nextValue);
  };

  return [getter, setter];
};

export const PARAMS = "PARAMS";
export const ROUTE_PARAMS = "ROUTE_PARAMS";

export const [getSearchParams, setSearchParams] = createState(PARAMS, new URLSearchParams(window.location.search));

export const [getRouteParams, setRouteParams] = createState(ROUTE_PARAMS, {});
