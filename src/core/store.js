import createState from "./state.js";

// createStore 의 기존 시그니처를 유지하여 외부 코드 변경 없이 새로운 상태 관리 로직을 사용할 수 있도록 한다.
export default function createStore(initialState) {
  return createState(initialState);
}

// 선택적으로 새 API를 동일 파일에서 재노출하여 점진적 마이그레이션 지원
export { createState };
