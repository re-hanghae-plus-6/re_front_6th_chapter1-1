import ProductList from '../product-list/ProductList.js';
import Component from '../../../../../core/Component.js';

class ProductContainer extends Component {
  constructor(element, props) {
    super(element, props);
  }

  render() {
    if (this.props.loading) {
      this.element.innerHTML = `
        <div id="product-list"></div>
      `;
    }

    if (!this.props.loading) {
      this.element.innerHTML = `
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${this.props.products.pagination.total}개</span>의 상품
        </div>
        <div id="product-list"></div>
      `;
    }

    new ProductList(this.element.querySelector('#product-list'), {
      loading: this.props.loading,
      products: this.props.products ? this.props.products.products : null,
    }).mount();
  }
}

export default ProductContainer;
