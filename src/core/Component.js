/**
 * 컴포넌트 이벤트 상수들
 *
 * @readonly
 * @enum {string}
 */
const COMPONENT_EVENTS = Object.freeze({
  BEFORE_MOUNT: "before-mount",
  MOUNT: "mount",
  BEFORE_UPDATE: "before-update",
  UPDATE: "update",
  BEFORE_UNMOUNT: "before-unmount",
  UNMOUNT: "unmount",
  FORCE_UPDATE: "force-update",
});

/**
 * 베이스 컴포넌트 추상클래스
 *
 * @abstract
 * @class Component
 * @description
 * - 모든 UI 컴포넌트의 기본이 되는 추상클래스입니다.
 * - 컴포넌트를 생성할 때 해당 클래스를 상속하여 구현해야 합니다.
 * - 이벤트 기반 라이프사이클 관리
 * - 상태 관리 및 자동 렌더링
 */
export class Component {
  static EVENTS = COMPONENT_EVENTS;

  #children = [];
  #childContainers = new Map();
  #events = new Map();
  #isDestroyed = false;

  constructor(props = {}) {
    this.props = { ...props };
    this.state = {};
    this.element = null;
    this.isMounted = false;

    if (this.constructor === Component) {
      throw new Error("추상 클래스는 인스턴스를 생성할 수 없습니다!");
    }
  }

  /**
   * 이벤트 리스너를 등록합니다
   *
   * @param {string} event - 이벤트 이름
   * @param {EventCallback} callback - 이벤트 발생 시 실행될 콜백 함수
   * @returns {Component} 메서드 체이닝을 위한 this 반환
   * @throws {Error} callback이 함수가 아닐 때
   */
  on(event, callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }
    this.#events.get(event).push(callback);

    return this;
  }

  /**
   * 이벤트를 발생시킵니다
   *
   * @param {string} event - 발생시킬 이벤트 이름
   * @param {...*} args - 콜백 함수에 전달할 인수들
   * @returns {boolean} 리스너가 하나 이상 존재했는지 여부
   */
  emit(event, ...args) {
    if (!this.#events.has(event)) return false;

    const listeners = this.#events.get(event).slice();
    listeners.forEach((callback) => {
      try {
        callback.apply(this, args);
      } catch (error) {
        console.error(`이벤트 리스너 실행 중 오류 (${event}):`, error);
      }
    });

    return true;
  }

  /**
   * 자식 컴포넌트를 추가합니다
   *
   * @param {Component} component - 추가할 자식 컴포넌트
   * @throws {Error} component가 Component 인스턴스가 아닐 때
   */
  addChild(component) {
    if (!(component instanceof Component)) {
      throw new Error("자식은 Component 인스턴스여야 합니다");
    }

    this.#children.push(component);

    // 이미 마운트된 상태라면 자식도 즉시 마운트
    if (this.isMounted) {
      this.#mountChild(component);
    }
  }

  /**
   * 자식 컴포넌트를 제거합니다
   *
   * @param {Component} component - 제거할 자식 컴포넌트
   */
  removeChild(component) {
    const index = this.#children.indexOf(component);
    if (index !== -1) {
      this.#children[index].unmount();
      this.#children.splice(index, 1);
      this.#childContainers.delete(component);
    }
  }

  /**
   * 컴포넌트의 상태를 업데이트합니다
   *
   * @param {object} newState - 업데이트할 상태 객체
   * @throws {Error} newState가 객체가 아닐 때
   *
   * @description
   * - 새로운 상태를 기존 상태와 병합합니다
   * - 마운트된 상태에서만 리렌더링을 수행합니다
   * - before-update와 update 이벤트를 발생시킵니다
   */
  setState(newState) {
    if (this.#isDestroyed) return;

    if (!newState || typeof newState !== "object") {
      throw new Error("state는 객체여야 합니다!");
    }

    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    if (this.isMounted) {
      this.emit(Component.EVENTS.BEFORE_UPDATE, this.props, prevState);
      this.#performUpdate();
      this.emit(Component.EVENTS.UPDATE, this.props, prevState);
    }
  }

  /**
   * 컴포넌트를 특정 컨테이너에 마운트합니다
   *
   * @param {HTMLElement} container - 컴포넌트를 마운트할 DOM 컨테이너
   * @throws {Error} container가 유효한 DOM 엘리먼트가 아닐 때
   * @throws {Error} createElement 실행 중 오류가 발생했을 때
   */
  mount(container) {
    if (this.isMounted) {
      console.warn("이미 마운트된 컴포넌트입니다.");
      return;
    }

    if (container.children.length > 0) {
      console.warn("컨테이너에 기존 내용이 있어서 정리합니다.");
      container.innerHTML = "";
    }

    if (!container || !container.appendChild) {
      throw new Error("유효한 DOM 컨테이너가 필요합니다.");
    }

    try {
      this.emit(Component.EVENTS.BEFORE_MOUNT);
      this.element = this.#createElement();
      container.appendChild(this.element);
      this.isMounted = true;

      // 자식 컴포넌트들 마운트
      this.#mountChildren();
      this.emit(Component.EVENTS.MOUNT);
    } catch (error) {
      this.isMounted = false;
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      throw error;
    }
  }

  /** 컴포넌트를 언마운트합니다 */
  unmount() {
    if (!this.isMounted) return;

    try {
      this.emit(Component.EVENTS.BEFORE_UNMOUNT);
      // 자식들 먼저 언마운트
      this.#unmountChildren();

      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }

      this.isMounted = false;
      this.#isDestroyed = true;

      this.emit(Component.EVENTS.UNMOUNT);
      this.#events.clear();
    } catch (error) {
      console.error("컴포넌트 언마운트 중 오류 발생:", error);
    }
  }

  /**
   * 컴포넌트를 강제로 다시 렌더링합니다
   */
  forceUpdate() {
    if (this.isMounted && !this.#isDestroyed) {
      this.#performUpdate();
      this.emit(Component.EVENTS.FORCE_UPDATE);
    }
  }

  /**
   * DOM 요소를 생성합니다
   *
   * @returns {HTMLElement} 생성된 DOM 엘리먼트
   * @description
   * - render() 메서드의 결과를 실제 DOM 엘리먼트로 변환하고, 필요한 이벤트 리스너를 추가하는 역할을 합니다.
   */
  #createElement() {
    const template = document.createElement("template");
    template.innerHTML = this.render().trim();

    const element = template.content.firstElementChild;
    if (!element) {
      throw new Error("render() must return valid HTML");
    }

    // 이벤트 리스너 추가를 위한 메소드 실행
    this.bindEvents(element);

    return element;
  }

  /**
   * 개별 자식 컴포넌트를 마운트합니다
   *
   * @param {Component} component - 마운트할 자식 컴포넌트
   * @private
   */
  #mountChild(component, childId = null) {
    let childSelector;
    if (childId !== null) {
      childSelector = `[data-child="${component.constructor.name}"][data-child-id="${childId}"]`;
    } else {
      childSelector = `[data-child="${component.constructor.name}"]`;
    }

    const childContainer = this.element.querySelector(childSelector);
    if (childContainer && !component.isMounted) {
      component.mount(childContainer);
      this.#childContainers.set(component, childContainer);
    }
  }

  /**
   * 모든 자식 컴포넌트를 마운트합니다
   *
   * @private
   */
  #mountChildren() {
    // 클래스별로 카운터 관리
    const classCounters = new Map();

    this.#children.forEach((child) => {
      const className = child.constructor.name;

      // 해당 클래스의 현재 인덱스 가져오기
      const currentIndex = classCounters.get(className) || 0;
      classCounters.set(className, currentIndex + 1);

      // 같은 클래스가 여러 개인지 확인
      const sameClassChildren = this.#children.filter((c) => c.constructor.name === className);
      const childId = sameClassChildren.length > 1 ? currentIndex : null;

      this.#mountChild(child, childId);
    });
  }

  /**
   * 모든 자식 컴포넌트를 언마운트합니다
   *
   * @private
   */
  #unmountChildren() {
    this.#children.forEach((child) => child.unmount());
    this.#childContainers.clear();
    this.#children.length = 0;
  }

  /**
   * 실제 DOM 업데이트를 수행합니다
   *
   * @private
   * @description
   * - 자식 컴포넌트들을 임시로 DOM에서 분리 (언마운트하지 않음)
   * - 메인 컨텐츠만 업데이트
   * - 분리된 자식 컴포넌트들을 새로운 위치에 다시 붙임
   */
  #performUpdate() {
    if (!this.element || !this.element.parentNode || this.#isDestroyed) {
      return;
    }

    try {
      // 1. 자식 컴포넌트들을 임시로 DOM에서 분리 (언마운트하지 않음)
      const detachedChildren = new Map();

      this.#children.forEach((child) => {
        if (child.isMounted && child.element) {
          const parentNode = child.element.parentNode;
          if (parentNode) {
            parentNode.removeChild(child.element);
            detachedChildren.set(child, child.element);
          }
        }
      });

      // 2. 메인 컨텐츠만 업데이트
      const newElement = this.#createElement();
      this.element.parentNode.replaceChild(newElement, this.element);
      this.element = newElement;

      // 3. 분리된 자식 컴포넌트들을 새로운 위치에 다시 붙임
      this.#children.forEach((child) => {
        if (detachedChildren.has(child)) {
          const childSelector = `[data-child="${child.constructor.name}"]`;
          const newChildContainer = this.element.querySelector(childSelector);

          if (newChildContainer) {
            newChildContainer.appendChild(detachedChildren.get(child));
            this.#childContainers.set(child, newChildContainer);
          }
        }
      });
    } catch (error) {
      console.error("DOM 업데이트 중 오류 발생:", error);
    }
  }

  /** 이벤트 리스너를 바인딩합니다 */
  bindEvents() {
    //
  }

  /**
   * 컴포넌트를 렌더링합니다
   *
   * @abstract
   * @returns {string} 렌더링된 HTML 문자열
   * @throws {Error} 자식클래스에서 구현하지 않았을 때
   *
   * @description
   * - 자식클래스에서 반드시 구현해야 하는 추상 메서드입니다.
   * - 컴포넌트의 현재 상태(state)와 속성(props)을 기반으로 HTML 문자열을 반환합니다.
   */
  render() {
    throw new Error("render must be implemented by subclass");
  }
}
