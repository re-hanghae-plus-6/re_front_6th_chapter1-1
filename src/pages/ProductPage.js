import { getProduct } from "../api/productApi";
import { Component } from "../core/Component";

export class ProductPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      product: {},
    };

    this.on(Component.EVENTS.MOUNT, () => {
      const { productId } = this.props.router.routeParams;
      this.#loadProduct(productId);
    });
  }

  async #loadProduct(productId) {
    try {
      const product = await getProduct(productId);
      this.setState({ product, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("상품 로딩 실패:", error.message);
        this.setState({ loading: false });
      }
    }
  }

  bindEvents(element) {
    element.addEventListener("click", (e) => {
      const route = e.target.dataset.route;
      if (route) {
        this.props.router.navigate(route);
      }
    });
  }

  render() {
    return /* HTML */ ` //
      <div>
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
}
