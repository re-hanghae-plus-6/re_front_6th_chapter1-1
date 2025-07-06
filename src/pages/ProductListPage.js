import { getCategories, getProducts } from "../api/productApi";
import { Component } from "../core/Component";

export class ProductListPage extends Component {
  constructor(router) {
    super("#root");
    this.state = {
      loading: false,
      products: [],
      pagination: {},
      filters: {},
      categories: {},
    };

    this.router = router;
    this.#attachEventListeners();
    this.#loadProductsAndCategories();
  }

  render() {
    this.element.innerHTML =
      /* HTML */
      `<div>
        <div>
          <nav>
            <button data-route="/product/${this.state.products[0]?.productId}">상품페이지 이동</button>
            &nbsp;|&nbsp;
            <button data-route="/404">404페이지 이동</button>
          </nav>
          <br />
          ${JSON.stringify(this.state)}
        </div>
      </div>`;
  }

  async #loadProductsAndCategories() {
    try {
      this.setState({ loading: true });
      const [products, categories] = await Promise.all([getProducts(), getCategories()]);
      this.setState({ ...products, categories });
    } catch (error) {
      if (error instanceof Error) {
        console.error("상품 및 카테고리 리스트 로딩 실패:", error.message);
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  #attachEventListeners() {
    if (this.state.loading) return;

    this.element.addEventListener("click", (e) => {
      const route = e.target.dataset.route;
      if (route) {
        this.router.navigate(route);
      }
    });
  }
}
