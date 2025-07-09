import Component from '../../../../../core/Component.js';
import ProductItem from '../product-item/ProductItem.js';
import ProductItemLoading from '../product-item-loading/ProductItemLoading.js';

class ProductList extends Component {
  constructor(element, props) {
    super(element, props);
  }

  renderNextPageLoading() {
    if (this.props.products && !this.props.products.pagination.hasNext) {
      return '';
    }

    return /* HTML */ `
      <div class="text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
      </div>
    `;
  }

  render() {
    this.element.innerHTML = /* HTML */ `
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
      ${this.renderNextPageLoading()}
    `;
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

    if (this.props.products.products) {
      const products = this.props.products.products;
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
