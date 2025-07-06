/**
 * 베이스 컴포넌트 추상클래스
 *
 * @abstract
 *
 * @description
 * - 모든 UI 컴포넌트의 기본이 되는 추상클래스입니다.
 * - 컴포넌트를 생성할 때 해당 클래스를 상속하여 구현해야 합니다.
 */
export class Component {
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.state = {};

    if (this.constructor === Component) {
      throw new Error("Component는 추상클래스 입니다.");
    }

    if (!this.element) {
      throw new Error(`선택자 '${selector}'에 해당하는 DOM 요소를 찾을 수 없습니다.`);
    }
  }

  /**
   * 컴포넌트의 상태를 업데이트 합니다.
   *
   * @description 새로운 상태를 기존 상태와 병합한 후 자동으로 렌더링을 수행합니다.
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * 컴포넌트를 렌더링하는 메소드입니다.
   *
   * @description 반드시 자식 클래스에서 구현해야 하는 추상 메서드입니다.
   */
  render() {
    throw new Error("render는 필수 메소드입니다. render를 구현해 주세요.");
  }
}
