export default class BaseComponent {
  constructor($el, props = {}) {
    this.target = $el;
    this.element = $el;
    this.props = props;
    this.state = {};

    // 재렌더링 시 보존할 요소들의 셀렉터를 지정
    this.preserveSelectors = props.preserveSelectors || [];

    // 이벤트 핸들러 추적을 위한 Map 초기화
    this._handlers = new Map();

    this.initialState();
  }

  initialState() {
    this.render();
  }

  setState(nextState) {
    const prevState = { ...this.state };
    const prevProps = { ...this.props };
    this.state = { ...this.state, ...nextState };

    this.reRender();
    this.componentDidUpdate(prevProps, prevState, this.state);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  template() {
    return ``;
  }

  // DOM만 업데이트, 사이드이펙트 없음
  reRender() {
    if (this.target) {
      // 보존할 요소들이 있는 경우 보존 로직 적용
      if (this.preserveSelectors.length > 0) {
        this.reRenderWithPreservation();
      } else {
        // 기본 재렌더링
        this.target.innerHTML = this.template();
      }
    }
  }

  // 요소 보존을 포함한 재렌더링
  reRenderWithPreservation() {
    const preservedElements = [];

    // 보존할 요소들을 DOM에서 제거하여 저장
    this.preserveSelectors.forEach((selector) => {
      const element = this.target.querySelector(selector);
      if (element) {
        preservedElements.push({
          selector,
          element,
        });
        element.remove();
      }
    });

    // 기본 재렌더링
    this.target.innerHTML = this.template();

    // 보존된 요소들 복원
    preservedElements.forEach(({ selector, element }) => {
      const newContainer = this.target.querySelector(selector);
      if (newContainer) {
        // 새 컨테이너를 보존된 요소로 교체
        newContainer.parentNode.replaceChild(element, newContainer);
      }
    });
  }

  // 초기 렌더링 + componentDidMount 호출
  render() {
    this.element = this.target;
    this.target.innerHTML = this.template();

    this.componentDidMount();
  }

  addEventDelegate(eventType, selector, callback) {
    const handler = (e) => {
      const target = e.target.closest(selector);
      if (!target) return;

      if (this.target.contains(target)) {
        callback.call(this, e, target);
      }
    };

    this.target.addEventListener(eventType, handler);

    // 이벤트 핸들러 추적
    if (!this._handlers.has(eventType)) {
      this._handlers.set(eventType, new Set());
    }
    this._handlers.get(eventType).add(handler);

    return () => this.removeEventHandler(eventType, handler);
  }

  removeEventHandler(eventType, handler) {
    this.target.removeEventListener(eventType, handler);
    this._handlers.get(eventType)?.delete(handler);
  }

  componentWillUnmount() {
    // 모든 이벤트 핸들러 정리
    this._handlers.forEach((handlers, eventType) => {
      handlers.forEach((handler) => {
        this.removeEventHandler(eventType, handler);
      });
    });
    this._handlers.clear();
  }
}
