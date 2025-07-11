import Component from '../../core/Component.js';
import ProductContainer from './components/product/product-container/ProductContainer.js';
import FilterContainer from './components/filter/filter-container/FilterContainer.js';
import { getCategories, getProducts } from '../../api/productApi.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'price_asc';
const DEFAULT_SEARCH = '';
const DEFAULT_CATEGORY1 = '';
const DEFAULT_CATEGORY2 = '';

class HomePage extends Component {
  constructor(element, props) {
    super(element, props);

    const params = new URLSearchParams(window.location.search);

    this.state = {
      loading: true,
      products: null,
      categories: null,
      query: {
        page: Number(params.get('page')) || DEFAULT_PAGE,
        limit: Number(params.get('limit')) || DEFAULT_LIMIT,
        sort: params.get('sort') || DEFAULT_SORT,
        search: params.get('search') || DEFAULT_SEARCH,
        category1: params.get('category1') || DEFAULT_CATEGORY1,
        category2: params.get('category2') || DEFAULT_CATEGORY2,
      },
    };
  }

  async onMount() {
    console.log('asd', this.state.query);
    const [products, categories] = await Promise.all([
      getProducts(this.state.query),
      getCategories(),
    ]);
    this.setState({
      loading: false,
      products,
      categories,
    });
  }

  fetchProducts({ page, limit, sort, search, category1, category2 }) {
    return getProducts({
      page,
      limit,
      sort,
      search,
      category1,
      category2,
    });
  }

  handleLimitChange = async (value) => {
    const newLimitValue = Number(value);
    const newProducts = await this.fetchProducts({
      page: this.state.query.page,
      limit: newLimitValue,
    });
    this.setState({
      ...this.state,
      loading: false,
      products: newProducts,
      query: {
        ...this.state.query,
        limit: newLimitValue,
      },
    });
  };

  handleSortChange = async (value) => {
    const newSortValue = value;
    const newProducts = await this.fetchProducts({
      page: DEFAULT_PAGE,
      sort: newSortValue,
    });
    this.setState({
      ...this.state,
      loading: false,
      products: newProducts,
      query: {
        ...this.state.query,
        page: DEFAULT_PAGE,
        sort: newSortValue,
      },
    });
  };

  handleSearchChange = async (value) => {
    const newSearchValue = value;
    const newProducts = await this.fetchProducts({
      page: DEFAULT_PAGE,
      search: newSearchValue,
    });
    this.setState({
      ...this.state,
      loading: false,
      products: newProducts,
      query: {
        ...this.state.query,
        page: DEFAULT_PAGE,
        search: newSearchValue,
      },
    });
  };

  handleCategoryChange = async (category1 = '', category2 = '') => {
    const newProducts = await this.fetchProducts({
      page: DEFAULT_PAGE,
      category1,
      category2,
    });
    this.setState({
      ...this.state,
      loading: false,
      products: newProducts,
      query: {
        ...this.state.query,
        page: DEFAULT_PAGE,
        category1,
        category2,
      },
    });
  };

  fetchNextPageProducts = async () => {
    if (this.state.loading || !this.state.products.pagination.hasNext) {
      return;
    }

    const nextPage = this.state.query.page + 1;
    const newProducts = await this.fetchProducts({
      page: nextPage,
      limit: this.state.query.limit,
      sort: this.state.query.sort,
    });

    this.setState({
      ...this.state,
      loading: false,
      products: {
        ...newProducts,
        products: [...this.state.products.products, ...newProducts.products],
      },
      query: {
        ...this.state.query,
        page: nextPage,
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
      onChangeSearch: this.handleSearchChange,
      onChangeCategory: this.handleCategoryChange,
      onFetchNextPageProducts: this.fetchNextPageProducts,
    }).mount();

    new ProductContainer(this.element.querySelector('#product-container'), {
      loading: this.state.loading,
      products: this.state.products,
    }).mount();
  }
}

export default HomePage;
