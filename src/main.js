import { Router } from './utils/router.js';
import HomePage from './pages/HomePage.js';
import NotFoundPage from './pages/NotFoundPage.js';
import ExamplePage from './pages/ExamplePage.js';

const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
    }),
  );

async function main() {
  const router = new Router();
  router.addRoute('/', {
    component: HomePage,
  });
  router.addRoute('/example', {
    component: ExamplePage,
  });
  router.addRoute('/404', {
    component: NotFoundPage,
  });

  router.init();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
