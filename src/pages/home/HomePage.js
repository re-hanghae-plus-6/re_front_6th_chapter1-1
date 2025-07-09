import Component from '../../core/Component.js';
import ProductContainer from './components/product/product-container/ProductContainer.js';
import FilterContainer from './components/filter/filter-container/FilterContainer.js';
import { getCategories, getProducts } from '../../api/productApi.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'price_asc';

class HomePage extends Component {
  constructor(element, props) {
    super(element, props);
    this.state = {
      loading: true,
      products: null,
      categories: null,
      query: {
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
        sort: DEFAULT_SORT,
      },
    };
  }

  async onMount() {
    const [products, categories] = await Promise.all([
      getProducts({
        page: this.state.query.page,
        limit: this.state.query.limit,
      }),
      getCategories(),
    ]);
    this.setState({
      loading: false,
      products,
      categories,
    });
  }

  handleLimitChange = async (value) => {
    const newLimitValue = Number(value);
    const products = await getProducts({
      page: this.state.query.page,
      limit: newLimitValue,
    });
    this.setState({
      ...this.state,
      loading: false,
      products,
      query: {
        ...this.state.query,
        limit: newLimitValue,
      },
    });
  };

  handleSortChange = async (value) => {
    const newSortValue = value;
    const products = await getProducts({
      page: this.state.query.page,
      sort: newSortValue,
    });
    this.setState({
      ...this.state,
      loading: false,
      products,
      query: {
        ...this.state.query,
        sort: newSortValue,
      },
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
      query: this.state.query,
      onChangeLimit: this.handleLimitChange,
      onChangeSort: this.handleSortChange,
    }).mount();

    new ProductContainer(this.element.querySelector('#product-container'), {
      loading: this.state.loading,
      products: this.state.products,
    }).mount();
  }
}

export default HomePage;
