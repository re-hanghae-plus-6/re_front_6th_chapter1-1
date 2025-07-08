/**
 * URL 파라미터를 관리하는 유틸리티
 */
export class URLManager {
  constructor() {
    this.url = new URL(window.location);
  }

  /**
   * URL 파라미터 값 가져오기
   */
  getParam(key, defaultValue = "") {
    return this.url.searchParams.get(key) || defaultValue;
  }

  /**
   * URL 파라미터 값 설정
   */
  setParam(key, value) {
    if (value === "" || value === null || value === undefined) {
      this.url.searchParams.delete(key);
    } else {
      this.url.searchParams.set(key, value);
    }
  }

  /**
   * 여러 파라미터 한번에 설정
   */
  setParams(params) {
    Object.entries(params).forEach(([key, value]) => {
      this.setParam(key, value);
    });
  }

  /**
   * URL 업데이트 (브라우저 히스토리에 추가)
   */
  updateURL() {
    window.history.pushState({}, "", this.url.toString());
  }

  /**
   * URL 교체 (브라우저 히스토리에 추가하지 않음)
   */
  replaceURL() {
    window.history.replaceState({}, "", this.url.toString());
  }

  /**
   * 현재 URL 파라미터를 객체로 반환
   */
  getParams() {
    const params = {};
    this.url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  /**
   * 파라미터 초기화
   */
  clearParams() {
    this.url.search = "";
  }
}

export const urlManager = new URLManager();
