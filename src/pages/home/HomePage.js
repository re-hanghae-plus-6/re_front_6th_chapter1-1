import Component from '../../core/Component.js';
import ProductContainer from './components/product/product-container/ProductContainer.js';
import FilterContainer from './components/filter/filter-container/FilterContainer.js';
import { getCategories, getProducts } from '../../api/productApi.js';
import { paramsUtils } from '../../utils/paramsUtils.js';

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
      error: null,
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

  async fetchProductsAndCategories() {
    try {
      const [products, categories] = await Promise.all([
        getProducts(this.state.query),
        getCategories(),
      ]);
      this.setState({
        ...this.state,
        loading: false,
        products,
        categories,
        error: null,
      });
    } catch (error) {
      this.setState({
        ...this.state,
        loading: false,
        error: error.message,
      });
    }
  }

  onMount() {
    this.fetchProductsAndCategories();
  }

  attachEventListeners() {
    this.addEventListener(this.element, 'click', (event) => {
      const retryBtn = event.target.closest('#retry-btn');
      if (retryBtn) {
        console.log('retryBtn');
        this.setState({ ...this.state, error: null, loading: true });
        this.fetchProductsAndCategories();
      }
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
      ...this.state.query,
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
    paramsUtils.updateUrlParams({
      limit: value,
    });
  };

  handleSortChange = async (value) => {
    const newSortValue = value;
    const newProducts = await this.fetchProducts({
      ...this.state.query,
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
    paramsUtils.updateUrlParams({
      sort: newSortValue,
    });
  };

  handleSearchChange = async (value) => {
    const newSearchValue = value;
    const newProducts = await this.fetchProducts({
      ...this.state.query,
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
    paramsUtils.updateUrlParams({
      search: newSearchValue,
      page: DEFAULT_PAGE,
    });
  };

  handleCategoryChange = async (category1 = '', category2 = '') => {
    const newProducts = await this.fetchProducts({
      ...this.state.query,
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
    paramsUtils.updateUrlParams({
      category1,
      category2,
      page: DEFAULT_PAGE,
    });
  };

  fetchNextPageProducts = async () => {
    if (this.state.loading || !this.state.products?.pagination?.hasNext) {
      return;
    }

    const nextPage = this.state.query.page + 1;
    const newProducts = await this.fetchProducts({
      ...this.state.query,
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

  renderErrorUI() {
    return /* HTML */ `
      <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
        <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
            </linearGradient>
            <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="8"
                flood-color="#000000"
                flood-opacity="0.1"
              />
            </filter>
          </defs>

          <!-- 404 Numbers -->
          <text
            x="160"
            y="85"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            font-size="48"
            font-weight="600"
            fill="url(#blueGradient)"
            text-anchor="middle"
          >
            500
          </text>

          <!-- Icon decoration -->
          <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8" />
          <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8" />
          <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5" />
          <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5" />

          <!-- Message -->
          <text
            x="160"
            y="110"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            font-size="14"
            font-weight="400"
            fill="#5f6368"
            text-anchor="middle"
          >
            ${this.state.error}
          </text>

          <!-- Subtle bottom accent -->
          <rect
            x="130"
            y="130"
            width="60"
            height="2"
            rx="1"
            fill="url(#blueGradient)"
            opacity="0.3"
          />
        </svg>

        <button
          id="retry-btn"
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-600 transition-colors"
        >
          다시시도
        </button>
      </div>
    `;
  }

  render() {
    this.element.innerHTML = /* HTML */ `
      <main class="max-w-md mx-auto px-4 py-4">
        <div id="filter-container"></div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div id="product-container"></div>
          ${this.state.error ? this.renderErrorUI() : ''}
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
