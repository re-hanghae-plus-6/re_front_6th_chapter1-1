import Component from '../../../../../core/Component.js';
import ProductItem from '../product-item/ProductItem.js';

class ProductList extends Component {
  constructor(element, props) {
    super(element, props);
  }

  render() {
    this.element.innerHTML = `
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
    `;

    new ProductItem(this.element.querySelector('#products-grid')).mount();
  }
}

export default ProductList;
