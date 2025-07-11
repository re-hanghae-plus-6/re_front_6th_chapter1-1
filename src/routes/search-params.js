import { getRelativePath } from "../utils/config.js";

/**
 * URLSearchParams를 기반으로 한 검색 파라미터 관리
 */
export class SearchParams {
  constructor() {
    this.listeners = [];
  }

  /**
   * 현재 URLSearchParams 객체 반환
   */
  getSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  /**
   * 특정 파라미터 값 가져오기
   */
  get(key, defaultValue = "") {
    const params = this.getSearchParams();
    return params.get(key) || defaultValue;
  }

  /**
   * 여러 파라미터 값 한번에 가져오기
   */
  getAll(keys) {
    const params = this.getSearchParams();
    const result = {};

    keys.forEach((key) => {
      result[key] = params.get(key) || "";
    });

    return result;
  }

  /**
   * 모든 파라미터를 객체로 반환
   */
  getAllParams() {
    const params = this.getSearchParams();
    const result = {};

    for (const [key, value] of params) {
      result[key] = value;
    }

    return result;
  }

  /**
   * 파라미터 설정 (단일)
   */
  set(key, value, options = {}) {
    const { replace = false } = options;
    const params = this.getSearchParams();

    if (value === "" || value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    this.updateURL(params, replace);
  }

  /**
   * 여러 파라미터 한번에 설정
   */
  setAll(paramsObject, options = {}) {
    const { replace = false } = options;
    const params = this.getSearchParams();

    Object.entries(paramsObject).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    this.updateURL(params, replace);
  }

  /**
   * 파라미터 삭제
   */
  delete(key, options = {}) {
    const { replace = false } = options;
    const params = this.getSearchParams();
    params.delete(key);
    this.updateURL(params, replace);
  }

  /**
   * 여러 파라미터 삭제
   */
  deleteAll(keys, options = {}) {
    const { replace = false } = options;
    const params = this.getSearchParams();

    keys.forEach((key) => {
      params.delete(key);
    });

    this.updateURL(params, replace);
  }

  /**
   * 모든 파라미터 클리어
   */
  clear(options = {}) {
    const { replace = false } = options;
    this.updateURL(new URLSearchParams(), replace);
  }

  /**
   * 파라미터 존재 여부 확인
   */
  has(key) {
    const params = this.getSearchParams();
    return params.has(key);
  }

  /**
   * URL 업데이트
   */
  updateURL(params, replace = false) {
    const relativePath = getRelativePath(window.location.pathname);
    const newSearch = params.toString();
    const newURL = newSearch ? `${relativePath}?${newSearch}` : relativePath;

    if (replace) {
      window.history.replaceState(null, "", newURL);
    } else {
      window.history.pushState(null, "", newURL);
    }

    // 리스너들에게 변경 알림
    this.notifyListeners();
  }

  /**
   * 파라미터 변경 리스너 등록
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * 파라미터 변경 리스너 제거
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * 리스너들에게 파라미터 변경 알림
   */
  notifyListeners() {
    const params = this.getAllParams();
    this.listeners.forEach((listener) => {
      try {
        listener(params);
      } catch (error) {
        console.error("SearchParams listener error:", error);
      }
    });
  }

  /**
   * 현재 검색 문자열 반환
   */
  toString() {
    return this.getSearchParams().toString();
  }
}

// 전역 SearchParams 인스턴스
export const searchParams = new SearchParams();
