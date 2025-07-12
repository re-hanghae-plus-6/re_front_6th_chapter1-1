import { HomePage } from './pages/HomePage.js';
import { ProductDetail } from './pages/ProductDetail.js';
import { getProducts, getCategories } from './api/productApi.js';
import { cart } from './pages/Cart.js';
import { getAppPath, getFullPath } from './utils/router.js';

const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker, workerOptions }) =>
    worker.start(workerOptions),
  );

let state = {
  products: [],
  categories: [],
  total: 0,
  loading: false,
  limit: 20,
  sort: 'price_asc',
  page: 1,
  hasMore: true,
  search: '',
  category1: '',
  category2: '',
};

function getStateFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    search: urlParams.get('search') || '',
    category1: decodeURIComponent(urlParams.get('category1') || ''),
    category2: decodeURIComponent(urlParams.get('category2') || ''),
    sort: urlParams.get('sort') || 'price_asc',
    limit: parseInt(urlParams.get('limit')) || 20,
  };
}

function updateURL() {
  const params = new URLSearchParams();

  if (state.search) params.set('search', state.search);
  if (state.category1) params.set('category1', state.category1);
  if (state.category2) params.set('category2', state.category2);
  if (state.sort !== 'price_asc') params.set('sort', state.sort);
  params.set('limit', state.limit.toString());

  const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newURL);
}

let isEventListenerSetUp = false;

let currentPage = null;

function getPathInfo() {
  const path = getAppPath();

  const productMatch = path.match(/^\/product\/(\d+)$/);
  if (productMatch) {
    return {
      type: 'product',
      productId: productMatch[1],
    };
  }

  if (path === '/' || path === '') {
    return {
      type: 'home',
    };
  }

  return {
    type: '404',
  };
}

async function renderPage() {
  const pathInfo = getPathInfo();

  if (pathInfo.type === 'product') {
    currentPage = new ProductDetail(pathInfo.productId);
    await currentPage.render();
  } else if (pathInfo.type === 'home') {
    currentPage = null;
    await renderHomePage();
  } else {
    document.querySelector('#root').innerHTML = `
      <main class="max-w-md mx-auto px-4 py-4">
        <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
          <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4">
            <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="#4285f4" text-anchor="middle">404</text>
            <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
          </svg>
          <a href="${getFullPath('/')}" class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</a>
        </div>
      </main>
    `;
  }
}

async function renderHomePage() {
  const urlState = getStateFromURL();
  state = { ...state, ...urlState };

  state.loading = true;
  render();

  const data = await getProducts({
    page: 1,
    limit: state.limit,
    search: state.search,
    sort: state.sort,
    category1: state.category1,
    category2: state.category2,
  });

  const categories = await getCategories();

  state.products = data.products;
  state.categories = categories;
  state.total = data.pagination.total;
  state.page = 1;
  state.hasMore = data.products.length === state.limit;
  state.loading = false;
  render();

  setUpEventListeners();
  cart.init();
}

function render() {
  document.body.querySelector('#root').innerHTML = HomePage(state);
}

async function loadMoreProducts() {
  if (state.loading || !state.hasMore) return;

  state.loading = true;
  render();

  try {
    const data = await getProducts({
      page: state.page + 1,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    state.products = [...state.products, ...data.products];
    state.page += 1;
    state.hasMore = data.products.length === state.limit;
    state.loading = false;
    render();
  } catch (error) {
    console.error('추가 상품 로드 실패:', error);
    state.loading = false;
    render();
  }
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreProducts();
  }
}

function setUpEventListeners() {
  if (isEventListenerSetUp) return;

  document.body
    .querySelector('#root')
    .addEventListener('keydown', async (e) => {
      if (e.target.id === 'search-input' && e.key === 'Enter') {
        const searchValue = e.target.value.trim();
        state.search = searchValue;
        state.page = 1;
        state.loading = true;
        updateURL();
        render();

        const data = await getProducts({
          search: searchValue,
          page: 1,
          limit: state.limit,
          sort: state.sort,
          category1: state.category1,
          category2: state.category2,
        });
        state.products = data.products;
        state.total = data.pagination.total;
        state.hasMore = data.products.length === state.limit;
        state.loading = false;
        render();
      }
    });

  document.body.querySelector('#root').addEventListener('click', async (e) => {
    if (
      e.target.matches('.product-image img') ||
      e.target.closest('.product-image')
    ) {
      const productCard = e.target.closest('.product-card');
      if (productCard) {
        const productId = productCard.dataset.productId;
        if (productId) {
          window.history.pushState(
            {},
            '',
            getFullPath(`/product/${productId}`),
          );
          await renderPage();
          return;
        }
      }
    }

    if (e.target.closest('#cart-icon-btn')) {
      cart.openModal();
      return;
    }

    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = e.target.dataset.productId;
      const product = state.products.find(
        (p) => p.productId.toString() === productId,
      );
      if (product) {
        const cartProduct = {
          id: product.productId,
          name: product.title,
          price: parseInt(product.lprice),
          image: product.image,
          brand: product.brand || '',
        };
        cart.addItem(cartProduct);
      }
      return;
    }

    // 카테고리 1depth 선택
    if (e.target.dataset.category1) {
      const selectedCategory1 = e.target.dataset.category1;
      state.category1 = selectedCategory1;
      state.category2 = ''; // 2depth 초기화
      state.page = 1;
      state.loading = true;
      updateURL();
      render();

      const data = await getProducts({
        category1: selectedCategory1,
        page: 1,
        limit: state.limit,
        sort: state.sort,
        search: state.search,
      });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === state.limit;
      state.loading = false;
      render();
    }

    // 카테고리 2depth 선택
    if (e.target.dataset.category2) {
      const selectedCategory2 = e.target.dataset.category2;
      state.category2 = selectedCategory2;
      state.page = 1;
      state.loading = true;
      updateURL();
      render();

      const data = await getProducts({
        category1: state.category1,
        category2: selectedCategory2,
        page: 1,
        limit: state.limit,
        sort: state.sort,
        search: state.search,
      });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === state.limit;
      state.loading = false;
      render();
    }

    // 브레드크럼 클릭
    if (e.target.dataset.breadcrumb === 'reset') {
      state.category1 = '';
      state.category2 = '';
      state.page = 1;
      state.loading = true;
      updateURL();
      render();

      const data = await getProducts({
        page: 1,
        limit: state.limit,
        sort: state.sort,
        search: state.search,
      });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === state.limit;
      state.loading = false;
      render();
    }

    if (e.target.dataset.breadcrumb === 'category1') {
      state.category2 = ''; // 2depth만 초기화
      state.page = 1;
      state.loading = true;
      updateURL();
      render();

      const data = await getProducts({
        category1: state.category1,
        page: 1,
        limit: state.limit,
        sort: state.sort,
        search: state.search,
      });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === state.limit;
      state.loading = false;
      render();
    }
  });

  document.body.querySelector('#root').addEventListener('change', async (e) => {
    if (e.target.id === 'limit-select') {
      const newLimit = parseInt(e.target.value);
      state.limit = newLimit;
      state.page = 1;
      state.loading = true;
      updateURL();
      render();

      const data = await getProducts({
        limit: newLimit,
        page: 1,
        search: state.search,
        sort: state.sort,
        category1: state.category1,
        category2: state.category2,
      });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === newLimit;
      state.loading = false;
      render();
    }
    if (e.target.id === 'sort-select') {
      const newSort = e.target.value;
      state.sort = newSort;
      state.page = 1;
      state.loading = true;
      updateURL();
      render();

      const data = await getProducts({
        sort: newSort,
        page: 1,
        search: state.search,
        limit: state.limit,
        category1: state.category1,
        category2: state.category2,
      });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === state.limit;
      state.loading = false;
      render();
    }
  });

  window.addEventListener('scroll', handleScroll);

  // popstate 이벤트 리스너는 main 함수에서 전역으로 설정
  // window.addEventListener('popstate', renderPage);

  isEventListenerSetUp = true;
}

export async function main() {
  // popstate 이벤트 리스너를 전역으로 설정
  window.addEventListener('popstate', renderPage);

  await renderPage();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
