import { createRouter } from './utils/router.js';
import { ROUTES } from './constants/routes.js';

const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker, workerOptions }) => worker.start(workerOptions));

function main() {
  createRouter(ROUTES);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
