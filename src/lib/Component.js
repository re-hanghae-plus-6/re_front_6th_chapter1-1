export default class Component {
  $target; // 이 컴포넌트가 렌더링될 부모 DOM 요소
  props; // 부모로부터 받은 props (속성)
  state; // 이 컴포넌트가 관리하는 상태

  constructor($target, props) {
    this.$target = $target; // 부모 DOM 요소 지정
    this.props = props; // props 지정
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

  render() {
    // 🔷 template()로부터 HTML 문자열을 받아
    // 부모 DOM에 렌더링하고, mounted()를 호출
    this.$target.innerHTML = this.template();
    this.setEvent(); // 이벤트 바인딩
    this.mounted?.(); // 하위 컴포넌트 렌더링
  }

  setEvent() {
    // 🔷 이벤트를 바인딩하는 메서드 (addEvent를 주로 활용)
  }

  setState(newState) {
    // 🔷 상태를 업데이트하고 render()를 호출해 화면을 갱신
    this.$state = { ...this.$state, ...newState };
    this.render();
  }
}
