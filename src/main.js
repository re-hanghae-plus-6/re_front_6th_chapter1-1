// Mock 서비스 워커 활성화
const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
      // GitHub Pages base path 고려
      serviceWorker: {
        url: import.meta.env.PROD
          ? '/front_6th_chapter1-1/mockServiceWorker.js'
          : '/mockServiceWorker.js',
      },
    }),
  );

// 컴포넌트들 import
import { Router } from './router/Router.js';
import { store } from './store/index.js';
import { ProductList } from './components/ProductList.js';
import { NotFound } from './components/NotFound.js';
import { ProductService } from './services/ProductService.js';
import { CartModal } from './components/CartModal.js';
import { ToastManager } from './components/Toast.js';
import { ProductDetailContainer } from './components/ProductDetailContainer.js';

// 라우터 인스턴스 생성
const router = new Router();

// 장바구니 모달 인스턴스 생성
const cartModal = new CartModal(store);

// 토스트 매니저 인스턴스 생성
const toastManager = new ToastManager();

// 상품 상세 컨테이너 인스턴스 생성
const productDetailContainer = new ProductDetailContainer();

// 상품 상세 페이지 컴포넌트 함수
function ProductDetailPage(params) {
  // 비동기적으로 상품 상세 페이지를 렌더링
  productDetailContainer.render(params.id);

  // 즉시 로딩 상태를 반환하여 Router가 올바른 Layout을 렌더링하도록 함
  return `
    <div class="py-20 bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
    </div>
  `;
}

// 라우트 등록
router.addRoute('/', ProductList);
router.addRoute('/product/:id', ProductDetailPage);
router.addRoute('404', NotFound);

// URL 파라미터 관리 유틸리티
function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    current: parseInt(params.get('current')) || 0,
    category1: params.get('category1') || '',
    category2: params.get('category2') || '',
    limit: parseInt(params.get('limit')) || 20,
    sort: params.get('sort') || 'price_asc',
    search: params.get('search') || '',
  };
}

function updateURLParams(updates) {
  const url = new URL(window.location);

  // current 파라미터 처리
  if (updates.current !== undefined) {
    if (updates.current && updates.current > 0) {
      url.searchParams.set('current', updates.current.toString());
    } else {
      url.searchParams.delete('current');
    }
  }

  // 필터 파라미터들 처리
  const filterParams = ['category1', 'category2', 'search', 'sort', 'limit'];
  filterParams.forEach((param) => {
    if (updates[param] !== undefined) {
      if (updates[param] !== null && updates[param] !== '') {
        // 모든 필터 파라미터를 URL에 유지 (빈 문자열이 아닌 경우)
        url.searchParams.set(param, updates[param].toString());
      } else {
        url.searchParams.delete(param);
      }
    }
  });

  // 현재 페이지 상태를 히스토리에 저장 (뒤로가기 지원)
  window.history.replaceState(null, '', url.toString());
}

// Store에서 사용할 수 있도록 전역으로 노출
window.updateURLParams = updateURLParams;
window.toastManager = toastManager;
window.router = router;
window.productDetailContainer = productDetailContainer;
window.store = store;
window.cartModal = cartModal;

// 헤더의 장바구니 카운트만 업데이트하는 함수
function updateCartCount() {
  const cartCountElement = document.querySelector('#cart-icon-btn span');
  const cartCount = store.getCartCount();

  if (cartCount > 0) {
    if (cartCountElement) {
      // 기존 카운트 업데이트
      cartCountElement.textContent = cartCount;
    } else {
      // 카운트 엘리먼트가 없으면 새로 생성
      const cartButton = document.getElementById('cart-icon-btn');
      if (cartButton) {
        const countElement = document.createElement('span');
        countElement.className =
          'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
        countElement.textContent = cartCount;
        cartButton.appendChild(countElement);
      }
    }
  } else {
    // 카운트가 0이면 카운트 엘리먼트 제거
    if (cartCountElement) {
      cartCountElement.remove();
    }
  }
}

// 장바구니 모달 렌더링 함수
function renderCartModal() {
  const { ui } = store.state;

  // 모달 컨테이너가 없으면 생성
  let modalContainer = document.getElementById('cart-modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'cart-modal-container';
    modalContainer.className = 'fixed inset-0 z-50';
    document.body.appendChild(modalContainer);
  }

  if (ui.showCart) {
    // 모달 표시 - CartModal이 모든 것을 직접 관리
    modalContainer.style.display = 'block';
    cartModal.renderWithBackdrop(modalContainer);

    // 바디 스크롤 방지
    document.body.style.overflow = 'hidden';
  } else {
    // 모달 숨김
    modalContainer.style.display = 'none';
    modalContainer.innerHTML = '';

    // 바디 스크롤 복원
    document.body.style.overflow = 'auto';
  }
}

// 이벤트 핸들러 설정
function setupEventHandlers() {
  // 전역 이벤트 위임
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('change', handleGlobalChange);
  document.addEventListener('keypress', handleGlobalKeypress);
  document.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('scroll', handleScroll);

  // 브라우저 뒤로가기/앞으로가기 지원
  window.addEventListener('popstate', handlePopState);

  // 상태 변경 구독 (렌더링이 필요한 변경만 감지)
  let lastRenderState = null;

  store.subscribe((state) => {
    const currentPath = router.getCurrentPath();
    const isProductDetailPage = currentPath.startsWith('/product/');

    // 상품 상세 페이지인 경우 특정 상태 변경에 대해서만 리렌더링
    if (isProductDetailPage) {
      // 상품 상세 페이지에서는 라우트 변경이나 에러 상태만 리렌더링 필요
      // 장바구니나 UI 상태 변경은 리렌더링하지 않음
      updateCartCount(); // 헤더의 장바구니 카운트만 업데이트
      renderCartModal(); // 장바구니 모달만 업데이트
      return;
    }

    // 상품 목록 페이지나 기타 페이지에서는 기존 로직 유지
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
        renderCartModal();
      });
    }
  });
}

// 전역 클릭 이벤트 핸들러
function handleGlobalClick(e) {
  const target = e.target;

  // 홈 링크 클릭 (초기 상태로 리셋)
  if (target.matches('#home-link')) {
    e.preventDefault();
    // 모든 필터와 검색 상태를 초기화
    store.resetToInitialState();
    // ProductDetailContainer 상태 리셋
    productDetailContainer.reset();
    // URL도 초기화
    updateURLParams({
      current: 0,
      category1: '',
      category2: '',
      search: '',
      sort: 'price_asc',
      limit: 20,
    });
    // 홈으로 이동
    router.navigate('/');
    return;
  }

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
      // 상품 상세 페이지로 이동
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

// 전역 키다운 이벤트 핸들러
function handleGlobalKeydown(e) {
  // ESC 키로 모달 닫기
  if (e.key === 'Escape' && store.state.ui.showCart) {
    store.toggleCart();
    return;
  }
}

// 스크롤 이벤트 핸들러 (무한 스크롤)
function handleScroll() {
  // 현재 경로가 상품 상세 페이지인지 확인
  const currentPath = router.getCurrentPath();
  const isProductDetailPage = currentPath.startsWith('/product/');

  // 상품 상세 페이지에서는 무한 스크롤 비활성화
  if (isProductDetailPage) {
    return;
  }

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

// 브라우저 뒤로가기/앞으로가기 이벤트 핸들러
function handlePopState() {
  // 현재 경로가 상품 상세 페이지인지 확인
  const currentPath = router.getCurrentPath();
  const isProductDetailPage = currentPath.startsWith('/product/');

  // 상품 상세 페이지가 아닐 때만 상품 목록 로드
  if (!isProductDetailPage) {
    loadProductsFromURL();
  }
}

// 상품 데이터 로딩 (URL 파라미터 기반)
async function loadProducts() {
  try {
    // 로딩 상태만 먼저 업데이트
    store.setState({
      loading: { ...store.state.loading, products: true },
      allProducts: [],
      pagination: null,
    });

    const urlParams = getURLParams();
    const { current: targetPageIndex, ...urlFilters } = urlParams;

    // URL에서 읽은 필터 정보를 Store에 반영
    store.setState({
      filters: {
        ...store.state.filters,
        ...urlFilters,
        page: 1, // 페이지는 항상 1부터 시작
      },
    });

    const filters = store.state.filters;

    // URL에서 지정한 페이지까지 순차적으로 로드 (0부터 시작)
    let allLoadedProducts = [];
    let finalPagination = null;

    for (let pageIndex = 0; pageIndex <= targetPageIndex; pageIndex++) {
      const pageFilters = { ...filters, page: pageIndex + 1 }; // API는 1부터 시작
      const response = await ProductService.fetchProducts(pageFilters);

      let pageProducts =
        response.products || response.data || response.results || response;
      if (!Array.isArray(pageProducts)) {
        pageProducts = [];
      }

      allLoadedProducts = [...allLoadedProducts, ...pageProducts];
      finalPagination = response.pagination || null;

      // 더 이상 로드할 페이지가 없으면 중단
      if (!finalPagination || !finalPagination.hasNext) {
        break;
      }
    }

    // 상품 데이터와 로딩 상태를 한 번에 업데이트 (무한루프 방지)
    store.setState({
      products: allLoadedProducts,
      allProducts: allLoadedProducts,
      pagination: finalPagination,
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

    // URL 파라미터 업데이트 (페이지 번호를 0 기반 인덱스로 변환)
    updateURLParams({ current: newPagination.page - 1 });
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
    // 현재 경로가 상품 상세 페이지인지 확인
    const currentPath = router.getCurrentPath();
    const isProductDetailPage = currentPath.startsWith('/product/');

    // 상품 상세 페이지에서는 필터 감지하지 않음
    if (isProductDetailPage) {
      return;
    }

    const currentFilters = state.filters;

    // 필터가 변경되었는지 확인 (로딩 상태 변경은 무시)
    const filtersChanged =
      JSON.stringify(previousFilters) !== JSON.stringify(currentFilters);

    if (filtersChanged && !state.loading.products) {
      // URL 업데이트로 인한 필터 변경인지 확인
      const urlParams = getURLParams();
      const urlFilters = {
        search: urlParams.search,
        category1: urlParams.category1,
        category2: urlParams.category2,
        sort: urlParams.sort,
        limit: urlParams.limit,
      };

      const isFromURL =
        JSON.stringify(urlFilters) ===
        JSON.stringify({
          search: currentFilters.search,
          category1: currentFilters.category1,
          category2: currentFilters.category2,
          sort: currentFilters.sort,
          limit: currentFilters.limit,
        });

      if (!isFromURL) {
        // 사용자가 직접 필터를 변경한 경우에만 로드
        // 이전 타이머 취소
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }

        // 디바운싱 적용 (100ms 지연)
        loadingTimeout = setTimeout(() => {
          loadProducts();
          previousFilters = { ...currentFilters };
        }, 100);
      } else {
        // URL에서 온 변경사항이면 단순히 이전 필터 업데이트
        previousFilters = { ...currentFilters };
      }
    }
  });
}

// 카테고리 데이터 로딩
async function loadCategories() {
  try {
    store.setState({
      loading: { ...store.state.loading, categories: true },
    });

    const categories = await ProductService.fetchCategories();
    store.setCategories(categories);

    store.setState({
      loading: { ...store.state.loading, categories: false },
    });
  } catch (error) {
    console.error('Failed to load categories:', error);
    store.setState({
      loading: { ...store.state.loading, categories: false },
    });
  }
}

// URL 파라미터 기반으로 상품 로딩 (Router에서 호출)
async function loadProductsFromURL() {
  try {
    const urlParams = getURLParams();

    // 현재 Store의 필터와 URL 파라미터 비교
    const currentFilters = store.state.filters;
    const urlFiltersComparison = {
      search: urlParams.search || '',
      category1: urlParams.category1 || '',
      category2: urlParams.category2 || '',
      sort: urlParams.sort || 'price_asc',
      limit: parseInt(urlParams.limit) || 20,
    };

    // 필터가 변경된 경우에만 새로 로드
    const filtersChanged =
      currentFilters.search !== urlFiltersComparison.search ||
      currentFilters.category1 !== urlFiltersComparison.category1 ||
      currentFilters.category2 !== urlFiltersComparison.category2 ||
      currentFilters.sort !== urlFiltersComparison.sort ||
      currentFilters.limit !== urlFiltersComparison.limit;

    if (filtersChanged) {
      // Store 필터 상태 업데이트
      store.setState({
        filters: {
          ...store.state.filters,
          ...urlFiltersComparison,
          page: 1,
        },
        loading: { ...store.state.loading, products: true },
        allProducts: [],
        pagination: null,
      });

      // 상품 로드
      await loadProducts();
    }
  } catch (error) {
    console.error('Failed to load products from URL:', error);
  }
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

    // 카테고리 데이터 로딩 (병렬 처리)
    const categoryPromise = loadCategories();

    // 전역 함수 노출
    window.updateURLParams = updateURLParams;
    window.updateCartCount = updateCartCount;
    window.loadProductsFromURL = loadProductsFromURL;

    // 현재 경로가 상품 상세 페이지가 아닐 때만 상품 목록 로드
    const currentPath = router.getCurrentPath();
    const isProductDetailPage = currentPath.startsWith('/product/');

    if (!isProductDetailPage) {
      // 초기 상품 로딩 (카테고리와 병렬 처리)
      await Promise.all([loadProducts(), categoryPromise]);
    } else {
      // 상품 상세 페이지인 경우 카테고리만 로드
      await categoryPromise;
    }

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
