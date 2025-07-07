/**
 * StateManager - 옵저버 패턴 기반 상태 관리 베이스 클래스
 *
 * 모든 도메인 매니저(ProductManager, CartManager, UIManager)의 부모 클래스로
 * 공통적인 상태 관리 기능을 제공합니다.
 *
 * 주요 기능:
 * - 키 기반 상태 구독/해제
 * - 상태 변경 시 자동 알림
 * - 효율적인 상태 업데이트
 */
class StateManager {
  constructor() {
    /** @type {Object} 상태 데이터를 저장하는 객체 */
    this.state = {};

    /** @type {Object.<string, Function[]>} 키별 옵저버 함수들을 저장하는 객체 */
    this.observers = {};
  }

  /**
   * 특정 상태 키(들)에 대한 변경 사항을 구독합니다.
   *
   * @param {string|string[]} keys - 구독할 상태 키 (문자열 또는 문자열 배열)
   * @param {Function} observer - 상태 변경 시 호출될 콜백 함수 (value, key, fullState) => void
   * @returns {Function} 구독을 해제하는 함수
   *
   * @example
   * // 단일 키 구독
   * const unsubscribe = manager.subscribe('loading', (isLoading, key, state) => {
   *   console.log('로딩 상태:', isLoading);
   * });
   *
   * // 여러 키 구독
   * const unsubscribe = manager.subscribe(['products', 'loading'], (value, key, state) => {
   *   if (key === 'products') console.log('상품 목록 변경:', value);
   *   if (key === 'loading') console.log('로딩 상태 변경:', value);
   * });
   *
   * // 구독 해제
   * unsubscribe();
   */
  subscribe(keys, observer) {
    const keyArray = Array.isArray(keys) ? keys : [keys];

    // 각 키에 대해 옵저버 등록
    keyArray.forEach((key) => {
      if (!this.observers[key]) this.observers[key] = [];
      this.observers[key].push(observer);
    });

    // 구독 해제 함수 반환
    return () => {
      keyArray.forEach((key) => {
        if (this.observers[key]) {
          const index = this.observers[key].indexOf(observer);
          if (index > -1) this.observers[key].splice(index, 1);
        }
      });
    };
  }

  /**
   * 특정 키를 구독한 모든 옵저버에게 상태 변경을 알립니다.
   *
   * @param {string} key - 변경된 상태 키
   * @param {*} value - 새로운 값
   */
  notify(key, value) {
    if (this.observers[key]) {
      this.observers[key].forEach((observer) => observer(value, key, this.state));
    }
  }

  /**
   * 상태를 업데이트하고 변경된 키들에 대해 옵저버들에게 알립니다.
   *
   * @param {Object} updates - 업데이트할 상태 객체 { key: value, ... }
   *
   * @example
   * manager.setState({ loading: true, error: null });
   * manager.setState({ products: [...newProducts] });
   */
  setState(updates) {
    Object.keys(updates).forEach((key) => {
      // 값이 실제로 변경된 경우에만 업데이트 및 알림
      if (this.state[key] !== updates[key]) {
        this.state[key] = updates[key];
        this.notify(key, updates[key]);
      }
    });
  }

  /**
   * 현재 상태를 조회합니다.
   *
   * @param {string|null} key - 조회할 상태 키 (null이면 전체 상태 반환)
   * @returns {*} 상태 값 또는 전체 상태 객체
   *
   * @example
   * const isLoading = manager.getState('loading');
   * const allState = manager.getState();
   */
  getState(key = null) {
    return key ? this.state[key] : this.state;
  }
}

export default StateManager;
