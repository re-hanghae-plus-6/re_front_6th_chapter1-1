export default class Component {
  $target; // 이 컴포넌트가 렌더링될 부모 DOM 요소
  props; // 부모로부터 받은 props (속성)
  state; // 이 컴포넌트가 관리하는 상태

  constructor($target, props) {
    this.$target = $target; // 부모 DOM 요소 지정
    this.props = props; // props 지정
    this.state = {}; // 초기 상태 설정
    this.child = new Map(); // 하위 컴포넌트 저장 (중복 인스턴스 방지)

    this.setup(); // 초기 상태 설정
    this.render(); // 초기 렌더링
  }

  setup() {
    // 🔷 초기 상태를 정의하거나 비동기 데이터 요청 등 초기화 작업
  }

  mounted() {
    // 🔷 DOM이 렌더링된 후 실행할 로직 (ex: DOM 접근, 포커스 설정 등)
    // 하위 컴포넌트 렌더링
  }

  template() {
    // 🔷 현재 상태와 props를 기반으로 HTML 문자열 반환
    // (렌더링할 UI를 정의)
    return "";
  }

  unmount() {
    // 🔷 컴포넌트가 언마운트될 때 실행할 로직
    // 하위 컴포넌트 정리 등

    this.cleanup();
    this.child.forEach((child) => child.cleanup?.());
    this.child.clear();
    this.$target.innerHTML = "";
  }

  cleanup() {
    // 🔷 기존 이벤트/자원을 정리하는 훅
    // 하위 클래스에서 오버라이드
  }

  render() {
    // 🔷 template()로부터 HTML 문자열을 받아
    // 부모 DOM에 렌더링하고, mounted()를 호출

    // 🔷 기존 자원 정리
    // !
    // this.cleanup();

    // 🔷 새로운 렌더링 시작
    this.$target.innerHTML = this.template();

    // 🔷 새 이벤트 바인딩
    this.setEvent();

    // 🔷 후처리
    this.mounted?.();
  }

  setEvent() {
    // 🔷 이벤트를 바인딩하는 메서드 (addEvent를 주로 활용)
  }

  setState(newState) {
    // 🔷 상태를 업데이트하고 render()를 호출해 화면을 갱신
    this.state = { ...this.state, ...newState };
    this.render();
  }

  getState() {
    return this.state;
  }

  addChild(childInstance, key) {
    this.child.set(key, childInstance);
  }

  removeChild(key) {
    const child = this.child.get(key);
    if (child?.cleanup) {
      child.cleanup();
    }
    this.child.delete(key);
  }

  destroy() {
    // 🔷 컴포넌트 완전 제거
    // 외부에서 강제로 unmount할 때 호출
    // 하위 컴포넌트 정리 및 부모 DOM 정리
    this.cleanup();
    this.child.forEach((child) => child.cleanup?.());
    this.child.clear();
    this.$target.innerHTML = "";
  }
}
