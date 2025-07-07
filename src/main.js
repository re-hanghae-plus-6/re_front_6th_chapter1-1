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
};

function render() {
  document.body.querySelector('#root').innerHTML = HomePage(state);
}

function setUpEventListeners() {
  document.body.querySelector('#root').addEventListener('change', async (e) => {
    if (e.target.id === 'limit-select') {
      const newLimit = parseInt(e.target.value);
      state.limit = newLimit;
      state.loading = true;
      render();

      const data = await getProducts({ limit: newLimit });
      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      render();
    }
  });
}

export async function main() {
  state.loading = true;
  render();
  const data = await getProducts({});
  console.log(data);
  state.products = data.products;
  state.total = data.pagination.total;
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
