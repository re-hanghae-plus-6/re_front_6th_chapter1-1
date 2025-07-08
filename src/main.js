import { HomePage } from './pages/HomePage.js';
import { getProducts } from './api/productApi.js';
const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
    }),
  );

let state = {
  products: [],
  total: 0,
  loading: false,
  limit: 20,
  sort: 'price_asc',
  page: 1,
  hasMore: true,
};

let isEventListenerSetUp = false;

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

  document.body.querySelector('#root').addEventListener('change', async (e) => {
    if (e.target.id === 'limit-select') {
      const newLimit = parseInt(e.target.value);
      state.limit = newLimit;
      state.page = 1;
      state.loading = true;
      render();

      const data = await getProducts({ limit: newLimit, page: 1 });
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
      render();

      const data = await getProducts({ sort: newSort, page: 1 });
      state.products = data.products;
      state.total = data.pagination.total;
      state.hasMore = data.products.length === state.limit;
      state.loading = false;
      render();
    }
  });

  window.addEventListener('scroll', handleScroll);

  isEventListenerSetUp = true;
}

export async function main() {
  state.loading = true;
  render();
  const data = await getProducts({ page: 1, limit: state.limit });
  console.log(data);
  state.products = data.products;
  state.total = data.pagination.total;
  state.page = 1;
  state.hasMore = data.products.length === state.limit;
  state.loading = false;
  render();

  setUpEventListeners();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
