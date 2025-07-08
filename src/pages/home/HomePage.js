import Component from '../../core/Component.js';
import ProductContainer from './components/product/product-container/ProductContainer.js';

class HomePage extends Component {
  constructor(element, props) {
    super(element, props);
  }

  render() {
    this.element.innerHTML = /* HTML */ `
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div id="product-container"></div>
      </main>
    `;

    new ProductContainer(this.element.querySelector('#product-container')).mount();
  }
}

export default HomePage;
