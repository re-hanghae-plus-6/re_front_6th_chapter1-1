// 간단한 상태관리 시스템
// Observer 패턴 사용

// 상태의 변경을 관찰하겠다.
// 변경되면 미리 정의힌 일련의 동작을 실행
class Store {
  constructor() {
    this.state = {
      products: [],
      categories: {},
      loading: false,
      error: null,
    };
    this.listeners = [];
  }

  // 상태 구독
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // 상태 변경 알림
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // 상태 업데이트
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // 로딩 시작
  setLoading(loading) {
    this.setState({ loading, error: null });
  }

  // 상품 설정
  setProducts(products) {
    this.setState({ products, loading: false, error: null });
  }

  setCategories(categories) {
    this.setState({ categories, loading: false, error: null });
  }

  // 에러 설정
  setError(error) {
    this.setState({ error, loading: false });
  }

  // 상태 초기화
  reset() {
    this.state = {
      products: [],
      loading: false,
      error: null,
    };
    this.listeners = [];
  }
}

// 전역 스토어 인스턴스
export const store = new Store();
