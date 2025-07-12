// src/features/common/search-params/search-params-store.ts
import { createStore } from "../../../store/create-store";

// 초기 상태: URLSearchParams 객체를 그대로 저장해도 되고, 파싱된 객체 형태로 저장해도 됩니다.
export const searchParamsStore = createStore<Record<string, string> | null>(getSearchParamsFromLocation());

// searchParams를 객체로 파싱
function getSearchParamsFromLocation(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}
export function initSearchParamsListener() {
  const updateStore = () => {
    const parsed = getSearchParamsFromLocation();
    searchParamsStore.setValue(parsed);
  };

  // 최초 상태 반영
  updateStore();

  // 이벤트 리스너는 여기서 한 번만 등록
  window.addEventListener("popstate", updateStore);

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
  };
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  window.addEventListener("pushstate", updateStore);
  window.addEventListener("replacestate", updateStore);
  window.addEventListener("locationchange", updateStore);
}
