import StateManager from "./StateManager.js";

/**
 * UIManager - UI 관련 상태 관리 클래스
 *
 * 토스트 메시지 등 사용자 인터페이스와 관련된 상태를 관리합니다.
 * StateManager를 상속받아 옵저버 패턴을 활용한 반응형 상태 관리를 제공합니다.
 *
 * 관리하는 상태:
 * - toast: 토스트 메시지 정보
 *
 * @example
 * import stateManager from './state/index.js';
 *
 * // 토스트 메시지 구독
 * stateManager.ui.subscribe('toast', (toast) => {
 *   if (toast) {
 *     showToastMessage(toast.message, toast.type);
 *   } else {
 *     hideToastMessage();
 *   }
 * });
 *
 * // 토스트 메시지 표시
 * stateManager.ui.showToast('성공적으로 저장되었습니다!', 'success');
 * stateManager.ui.showToast('오류가 발생했습니다.', 'error');
 * stateManager.ui.showToast('경고입니다!', 'warning', 5000);
 */
class UIManager extends StateManager {
  constructor() {
    super();

    /** UI 관련 상태 정의 */
    this.state = {
      /** @type {Object|null} 토스트 메시지 정보 { message, type, id } */
      toast: null,
    };
  }

  /**
   * 토스트 메시지를 표시합니다.
   * 지정된 시간 후 자동으로 사라지며, 동일한 ID를 가진 토스트만 제거합니다.
   *
   * @param {string} message - 표시할 메시지
   * @param {string} [type='info'] - 토스트 타입 ('success', 'error', 'warning', 'info')
   * @param {number} [duration=3000] - 표시 시간 (밀리초)
   *
   * @example
   * // 기본 정보 메시지
   * stateManager.ui.showToast('알림 메시지입니다.');
   *
   * // 성공 메시지
   * stateManager.ui.showToast('저장되었습니다!', 'success');
   *
   * // 에러 메시지
   * stateManager.ui.showToast('오류가 발생했습니다.', 'error');
   *
   * // 경고 메시지 (5초간 표시)
   * stateManager.ui.showToast('주의하세요!', 'warning', 5000);
   */
  showToast(message, type = "info", duration = 3000) {
    const toast = { message, type, id: Date.now() };
    this.setState({ toast });

    // 지정된 시간 후 해당 토스트만 제거 (다른 토스트가 표시된 경우 제거하지 않음)
    setTimeout(() => {
      if (this.state.toast?.id === toast.id) {
        this.setState({ toast: null });
      }
    }, duration);
  }

  /**
   * 현재 표시중인 토스트 메시지를 즉시 숨깁니다.
   *
   * @example
   * stateManager.ui.hideToast();
   */
  hideToast() {
    this.setState({ toast: null });
  }

  /**
   * 상태를 초기 상태로 리셋합니다.
   * 테스트 환경에서 테스트 간 상태 초기화용으로 사용됩니다.
   */
  reset() {
    // 구독자들은 유지하고 상태만 초기화
    this.state = {
      toasts: [],
    };
  }
}

export default UIManager;
