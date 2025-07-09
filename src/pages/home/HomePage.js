import Component from '../../core/Component.js';
import ProductContainer from './components/product/product-container/ProductContainer.js';
import FilterContainer from './components/filter/filter-container/FilterContainer.js';
import { getCategories, getProducts } from '../../api/productApi.js';

class HomePage extends Component {
  constructor(element, props) {
    super(element, props);
    this.state = {
      loading: true,
      products: null,
      categories: null,
      page: 1,
      limit: 20,
    };
  }

  async onMount() {
    const [products, categories] = await Promise.all([
      getProducts({
        page: this.state.page,
        limit: this.state.limit,
      }),
      getCategories(),
    ]);
    this.setState({
      loading: false,
      products,
      categories,
    });
  }

  handleLimitChange = async (event) => {
    const newLimit = Number(event.target.value);
    const products = await getProducts({
      page: this.state.page,
      limit: newLimit,
    });
    this.setState({
      ...this.state,
      loading: false,
      products,
      limit: newLimit,
    });
  };

  render() {
    this.element.innerHTML = /* HTML */ `
      <main class="max-w-md mx-auto px-4 py-4">
     
        <div id="filter-container"></div>
      
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div id="product-container"></div>
      </main>
    `;

    new FilterContainer(this.element.querySelector('#filter-container'), {
      loading: this.state.loading,
      categories: this.state.categories,
      limit: this.state.limit,
      onChangeLimit: this.handleLimitChange,
    }).mount();

    new ProductContainer(this.element.querySelector('#product-container'), {
      loading: this.state.loading,
      products: this.state.products,
    }).mount();
  }
}

export default HomePage;
