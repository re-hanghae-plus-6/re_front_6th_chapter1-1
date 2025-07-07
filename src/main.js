import { HomePage } from './pages/HomePage.js';
import { getProducts } from './api/productApi.js';
const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
    }),
  );

/*
function main(){
  getProducts({}).then(console.log);
  document.body.querySelector('#root').innerHTML = HomePage;
}
  */

let state = {
  products: [],
  total: 0,
  loading: false,
};

function render() {
  document.body.querySelector('#root').innerHTML = HomePage(state);
}

async function main() {
  state.loading = true;
  render();
  const data = await getProducts({});
  console.log(data);
  state.products = data.products;
  state.total = data.pagination.total;
  state.loading = false;
  render();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
