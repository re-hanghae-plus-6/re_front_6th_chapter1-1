// Mock 서비스 워커 활성화
const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
    }),
  );

// 컴포넌트들 import
import { Router } from './router/Router.js';
import { store } from './store/index.js';
import { ProductList } from './components/ProductList.js';
import { NotFound } from './components/NotFound.js';
import { ProductService } from './services/ProductService.js';

// 라우터 인스턴스 생성
const router = new Router();

// 라우트 등록
router.addRoute('/', ProductList);
router.addRoute('404', NotFound);

// 이벤트 핸들러 설정
function setupEventHandlers() {
  // 전역 이벤트 위임
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('change', handleGlobalChange);
  document.addEventListener('keypress', handleGlobalKeypress);
  document.addEventListener('scroll', handleScroll);

  // 상태 변경 구독 (렌더링이 필요한 변경만 감지)
  let lastRenderState = null;

  store.subscribe((state) => {
    // 렌더링에 영향을 주는 상태만 확인
    const renderRelevantState = {
      products: state.products,
      cart: state.cart,
      loading: state.loading,
      ui: state.ui,
    };

    // 이전 렌더링 상태와 비교
    if (
      JSON.stringify(lastRenderState) !== JSON.stringify(renderRelevantState)
    ) {
      lastRenderState = renderRelevantState;

      // requestAnimationFrame으로 렌더링 디바운싱
      requestAnimationFrame(() => {
        router.render();
      });
    }
  });
}

// 전역 클릭 이벤트 핸들러
function handleGlobalClick(e) {
  const target = e.target;

  // 장바구니 아이콘 클릭
  if (target.matches('#cart-icon-btn') || target.closest('#cart-icon-btn')) {
    store.toggleCart();
    return;
  }

  // 장바구니 담기 버튼
  if (target.matches('.add-to-cart-btn')) {
    const productId = target.dataset.productId;
    const product = store.state.products.find((p) => p.id === productId);
    if (product) {
      store.addToCart(product, 1);
    }
    return;
  }

  // 상품 이미지/정보 클릭 (상세 페이지로 이동)
  if (
    target.matches('.product-image, .product-info') ||
    target.closest('.product-image, .product-info')
  ) {
    const productCard = target.closest('.product-card');
    if (productCard) {
      const productId = productCard.dataset.productId;
      router.navigate(`/product/${productId}`);
    }
    return;
  }

  // 카테고리 필터 버튼
  if (target.matches('.category1-filter-btn')) {
    const category1 = target.dataset.category1;
    store.updateFilters({ category1, category2: '' });
    return;
  }

  if (target.matches('.category2-filter-btn')) {
    const category1 = target.dataset.category1;
    const category2 = target.dataset.category2;
    store.updateFilters({ category1, category2 });
    return;
  }

  // 브레드크럼 버튼
  if (target.matches('[data-breadcrumb="reset"]')) {
    store.updateFilters({ category1: '', category2: '' });
    return;
  }

  if (target.matches('[data-breadcrumb="category1"]')) {
    const category1 = target.dataset.category1;
    store.updateFilters({ category1, category2: '' });
    return;
  }
}

// 전역 변경 이벤트 핸들러
function handleGlobalChange(e) {
  const target = e.target;

  // 정렬 변경
  if (target.matches('#sort-select')) {
    store.updateFilters({ sort: target.value });
    return;
  }

  // 페이지당 상품 수 변경
  if (target.matches('#limit-select')) {
    store.updateFilters({ limit: parseInt(target.value) });
    return;
  }
}

// 전역 키프레스 이벤트 핸들러
function handleGlobalKeypress(e) {
  // 검색창에서 Enter 키
  if (e.target.matches('#search-input') && e.key === 'Enter') {
    const searchValue = e.target.value.trim();
    store.updateFilters({ search: searchValue });
    return;
  }
}

// 스크롤 이벤트 핸들러 (무한 스크롤)
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const { pagination, loading } = store.state;

  // 페이지 하단에 가까워졌는지 확인 (100px 여유분)
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    // 로딩 중이 아니고 다음 페이지가 있는 경우에만 로드
    if (!loading.products && pagination && pagination.hasNext) {
      loadMoreProducts();
    }
  }
}

// 상품 데이터 로딩 (첫 페이지)
async function loadProducts() {
  try {
    // 로딩 상태만 먼저 업데이트
    store.setState({
      loading: { ...store.state.loading, products: true },
      allProducts: [],
      pagination: null,
    });

    const filters = store.state.filters;
    const response = await ProductService.fetchProducts(filters);

    let products =
      response.products || response.data || response.results || response;
    if (!Array.isArray(products)) {
      products = [];
    }

    // 페이지네이션 정보 추출
    const pagination = response.pagination || null;

    // 상품 데이터와 로딩 상태를 한 번에 업데이트 (무한루프 방지)
    store.setState({
      products: products,
      allProducts: products, // 첫 페이지는 allProducts에도 설정
      pagination: pagination,
      loading: { ...store.state.loading, products: false },
    });
  } catch (error) {
    console.error('Failed to load products:', error);
    store.setState({
      products: [],
      allProducts: [],
      pagination: null,
      loading: { ...store.state.loading, products: false },
    });
  }
}

// 추가 상품 로딩 (무한 스크롤용)
async function loadMoreProducts() {
  try {
    const { pagination, loading } = store.state;

    if (!pagination || !pagination.hasNext || loading.loadingMore) {
      return;
    }

    // 추가 로딩 상태 설정
    store.setState({
      loading: { ...store.state.loading, loadingMore: true },
    });

    const filters = {
      ...store.state.filters,
      page: pagination.page + 1,
    };

    const response = await ProductService.fetchProducts(filters);

    let newProducts =
      response.products || response.data || response.results || response;
    if (!Array.isArray(newProducts)) {
      newProducts = [];
    }

    // 기존 상품에 새 상품 추가
    const updatedAllProducts = [...store.state.allProducts, ...newProducts];
    const newPagination = response.pagination || null;

    store.setState({
      products: updatedAllProducts, // products는 화면에 표시되는 전체 상품
      allProducts: updatedAllProducts,
      pagination: newPagination,
      loading: { ...store.state.loading, loadingMore: false },
    });
  } catch (error) {
    console.error('Failed to load more products:', error);
    store.setState({
      loading: { ...store.state.loading, loadingMore: false },
    });
  }
}

// 필터 변경 감지 (디바운싱 적용)
function observeFilters() {
  let previousFilters = { ...store.state.filters };
  let loadingTimeout = null;

  store.subscribe((state) => {
    const currentFilters = state.filters;

    // 필터가 변경되었는지 확인 (로딩 상태 변경은 무시)
    const filtersChanged =
      JSON.stringify(previousFilters) !== JSON.stringify(currentFilters);

    if (filtersChanged && !state.loading.products) {
      // 이전 타이머 취소
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }

      // 디바운싱 적용 (100ms 지연)
      loadingTimeout = setTimeout(() => {
        loadProducts();
        previousFilters = { ...currentFilters };
      }, 100);
    }
  });
}

// 앱 초기화
async function initializeApp() {
  try {
    // HTML 루트 요소 생성
    document.body.innerHTML = '<div id="root"></div>';

    // 이벤트 핸들러 설정
    setupEventHandlers();

    // 필터 변경 감지 시작
    observeFilters();

    // 초기 상품 로딩
    await loadProducts();

    // 라우터 초기 렌더링
    router.render();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// 앱 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(initializeApp);
} else {
  initializeApp();
}
