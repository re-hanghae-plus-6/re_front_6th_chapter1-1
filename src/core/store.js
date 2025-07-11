import createState from "./state.js";

export default function createStore(initialState) {
  return createState(initialState);
}

// 선택적으로 새 API를 동일 파일에서 재노출하여 점진적 마이그레이션 지원
export { createState };
