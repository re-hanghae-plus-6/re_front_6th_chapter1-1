import { getProducts } from "../api/productApi.js";

const Home = {
  el: null, // 컴포넌트의 DOM 요소를 저장할 곳
  state: {
    products: [],
    loading: true,
  },

  // 데이터를 불러오는 로직 (변경 없음)
  async fetchProducts() {
    this.setState({ loading: true });
    try {
      const data = await getProducts();
      this.setState({ products: data.products, loading: false });
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
      this.setState({ loading: false });
    }
  },

  // 상태를 변경하고, 변경될 때마다 화면을 다시 그리는 함수
  setState(newState) {
    this.state = { ...this.state, ...newState };

    // el이 존재할 때만 다시 그립니다.
    if (this.el) {
      this.el.innerHTML = this.template();
    }
  },

  // HTML 템플릿을 반환하는 함수 (변경 없음)
  template() {
    if (this.state.loading) {
      return `<p>카테고리 로딩 중...</p>`;
    }
    if (!this.state.products || !this.state.products.length) {
      return `<p>표시할 상품이 없습니다.</p>`;
    }
    return `
  총 의 상품
          <ul class="product-list grid grid-cols-2 gap-4">
            ${this.state.products
              .map(
                (item) => `
              <li class="product-item border rounded-lg overflow-hidden shadow-sm">
                <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover"
 />
                <div class="p-3">
                  <h3 class="font-bold truncate">${item.title}</h3>
                  <p>${parseInt(item.lprice).toLocaleString()}원</p>
                </div>                       
              </li>                          
            `,
              )
              .join("")}                     
          </ul>                              
        `;
  },

  // ✅ 1. render: 컴포넌트의 뼈대를 생성하고 초기 HTML을 채워서 반환합니다.
  render() {
    const el = document.createElement("div");
    el.className = "home-page";
    el.innerHTML = this.template();

    this.el = el; // 자신의 DOM 요소를 기억합니다.
    return el;
  },

  // ✅ 2. afterRender: 컴포넌트가 화면에 추가된 '후에' 호출될 함수입니다.
  addEvent() {},
  init() {
    // 여기서 데이터를 로드합니다.
    this.fetchProducts();
  },
};

export default Home;
