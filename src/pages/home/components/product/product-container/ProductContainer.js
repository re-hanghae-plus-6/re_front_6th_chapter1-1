import ProductList from '../product-list/ProductList.js';
import Component from '../../../../../core/Component.js';

class ProductContainer extends Component {
  constructor(element, props) {
    super(element, props);
  }

  render() {
    this.element.innerHTML = `
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">340개</span>의 상품
      </div>
      <div id="product-list"></div>
    `;

    new ProductList(this.element.querySelector('#product-list')).mount();
  }
}

export default ProductContainer;
