import { Layout } from '../components/Layout.js';

export class Router {
  constructor() {
    this.routes = {};
    this.currentPath = '';

    // 히스토리 변경 이벤트 리스너 (일반 URL 라우팅)
    window.addEventListener('popstate', () => this.render());
    window.addEventListener('load', () => this.render());

    // data-link 속성을 가진 링크들에 대한 이벤트 위임
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
        e.preventDefault();
        const link = e.target.matches('[data-link]')
          ? e.target
          : e.target.closest('[data-link]');
        const href = link.getAttribute('href');
        if (href) {
          this.navigate(href);
        }
      }
    });
  }

  addRoute(path, component) {
    this.routes[path] = component;
  }

  navigate(path) {
    if (path !== this.getCurrentPath()) {
      window.history.pushState(null, '', path);
      this.render();
    }
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  getParams() {
    const path = this.getCurrentPath();
    const params = {};

    // /product/:id 같은 패턴 매칭
    for (const routePath in this.routes) {
      if (routePath.includes(':')) {
        const routeParts = routePath.split('/');
        const pathParts = path.split('/');

        if (routeParts.length === pathParts.length) {
          let isMatch = true;
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              params[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              isMatch = false;
              break;
            }
          }
          if (isMatch) {
            return { path: routePath, params };
          }
        }
      }
    }

    return { path, params };
  }

  render() {
    const { path: matchedPath, params } = this.getParams();
    const currentPath = this.getCurrentPath();

    // 상품 상세 페이지가 아닌 경우 ProductDetailContainer 상태 리셋
    if (!currentPath.startsWith('/product/') && window.productDetailContainer) {
      window.productDetailContainer.reset();
    }

    // 정확한 경로가 있는지 확인
    let component = this.routes[currentPath] || this.routes[matchedPath];

    if (!component) {
      // 404 처리
      component =
        this.routes['404'] || (() => '<div>페이지를 찾을 수 없습니다.</div>');
    }

    // 루트 요소에 렌더링
    const root = document.getElementById('root');
    if (root) {
      const content = component(params);

      // 상품 상세 페이지인 경우 적절한 Layout 옵션 제공
      if (currentPath.startsWith('/product/')) {
        root.innerHTML = Layout({
          title: '상품 상세',
          showBackButton: true,
          content: content,
        });
      } else {
        root.innerHTML = Layout(content);
      }
    }

    // 상품 목록 페이지로 이동 시 URL 파라미터를 Store에 반영하고 상품 로드
    if (
      currentPath === '/' &&
      typeof window !== 'undefined' &&
      window.loadProductsFromURL
    ) {
      // URL 파라미터가 변경된 경우에만 상품 로드
      window.loadProductsFromURL();
    }

    this.currentPath = currentPath;
  }
}
