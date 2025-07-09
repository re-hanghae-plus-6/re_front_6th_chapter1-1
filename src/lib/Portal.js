class Portal {
  constructor() {
    this.containers = new Map();
  }

  /**
   * 포털 컨테이너 생성
   * @param {string} portalId - 포털 ID (modal, toast 등)
   * @param {string} zIndex - z-index 클래스 (선택사항)
   */
  createContainer(portalId, zIndex = "z-50") {
    let $container = document.getElementById(portalId);

    if ($container) {
      this.containers.set(portalId, $container);
      return $container;
    }

    $container = document.createElement("div");
    $container.id = portalId;
    $container.className = `portal-container fixed inset-0 pointer-events-none ${zIndex}`;

    // body의 가장 마지막 자식으로 추가 (최상단)
    document.body.appendChild($container);
    this.containers.set(portalId, $container);

    return $container;
  }

  /**
   * 포털에 컨텐츠 렌더링
   * @param {string} contents - HTML 컨텐츠
   * @param {string} portalId - 포털 ID
   * @param {Object} options - 옵션
   */
  render(contents, portalId, options = {}) {
    const { append = false, enablePointerEvents = true } = options;

    let $container = this.getContainer(portalId);

    // 컨테이너가 없으면 생성
    if (!$container) {
      $container = this.createContainer(portalId);
    }

    // 컨텐츠 래퍼 생성
    const $wrapper = document.createElement("div");
    $wrapper.className = "portal-item";

    if (enablePointerEvents) {
      $wrapper.style.pointerEvents = "auto";
    }

    $wrapper.innerHTML = contents;

    // 기존 컨텐츠 유지할지 결정
    if (!append) {
      $container.innerHTML = "";
    }

    $container.appendChild($wrapper);
    return $wrapper;
  }

  /**
   * 포털 컨테이너 가져오기
   * @param {string} portalId - 포털 ID
   */
  getContainer(portalId) {
    return this.containers.get(portalId) || document.getElementById(portalId);
  }

  /**
   * 포털 컨텐츠 제거
   * @param {string} portalId - 포털 ID
   * @param {HTMLElement} specificElement - 특정 엘리먼트만 제거할 경우
   */
  remove(portalId, specificElement = null) {
    const $container = this.getContainer(portalId);
    if (!$container) return;

    if (specificElement && $container.contains(specificElement)) {
      $container.removeChild(specificElement);
    } else {
      $container.innerHTML = "";
    }
  }

  /**
   * 포털 컨테이너 완전 제거
   * @param {string} portalId - 포털 ID
   */
  destroy(portalId) {
    const $container = this.getContainer(portalId);
    if ($container && $container.parentNode) {
      $container.parentNode.removeChild($container);
      this.containers.delete(portalId);
    }
  }
}

// 전역 포털 인스턴스
const portal = new Portal();

// 편의 함수들
export const createPortal = (contents, portalId, options) =>
  portal.render(contents, portalId, options);
export const removePortal = (portalId, element) => portal.remove(portalId, element);
export const destroyPortal = (portalId) => portal.destroy(portalId);

export default portal;
