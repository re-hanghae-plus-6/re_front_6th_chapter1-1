import { getProduct } from "../api/productApi";
import { Component } from "../core/Component";

export class ProductPage extends Component {
  constructor(router) {
    super("#root");
    this.state = {
      loading: false,
      product: {},
    };

    this.router = router;
    this.#attachEventListeners();
  }

  /**
   * 라우터에서 호출되는 파라미터 설정 메서드
   *
   * @param {Object} routeParams - 라우트 파라미터 (:id 등)
   * @param {Object} queryParams - 쿼리 파라미터 (?page=1 등)
   */
  setRouteParams(routeParams = {}, queryParams = {}) {
    this.setState({
      ...this.state,
      routeParams,
      queryParams,
    });

    this.#loadProduct(routeParams.productId);
  }

  render() {
    this.element.innerHTML =
      /* HTML */
      `<div>
        <div>
          <nav>
            <button data-route="/">메인페이지 이동</button>
            &nbsp;|&nbsp;
            <button data-route="/404">404페이지 이동</button>
          </nav>
          <br />
          ${JSON.stringify(this.state)}
        </div>
      </div>`;
  }

  async #loadProduct(productId) {
    try {
      this.setState({ loading: true });
      const product = await getProduct(productId);
      this.setState({ product });
    } catch (error) {
      if (error instanceof Error) {
        console.error("상품 로딩 실패:", error.message);
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
