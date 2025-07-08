import Component from '../../../../../core/Component.js';
import ProductItem from '../product-item/ProductItem.js';
import ProductItemLoading from '../product-item-loading/ProductItemLoading.js';

class ProductList extends Component {
  constructor(element, props) {
    super(element, props);
  }

  render() {
    this.element.innerHTML = `<div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>`;
    const grid = this.element.querySelector('#products-grid');

    if (this.props.loading) {
      const fragment = document.createDocumentFragment();

      [...Array(4)].forEach(() => {
        const loadingElement = document.createElement('div');
        new ProductItemLoading(loadingElement).mount();
        fragment.appendChild(loadingElement);
      });

      grid.appendChild(fragment);
      return;
    }

    if (this.props.products) {
      const products = this.props.products;
      const fragment = document.createDocumentFragment();
      products.forEach((product) => {
        const itemDiv = document.createElement('div');
        new ProductItem(itemDiv, product).mount();
        fragment.appendChild(itemDiv);
      });
      grid.appendChild(fragment);
    }
  }
}

export default ProductList;
