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
import { CartModal } from './components/CartModal.js';

// 라우터 인스턴스 생성
const router = new Router();

// 장바구니 모달 인스턴스 생성
const cartModal = new CartModal(store);

// 라우트 등록
router.addRoute('/', ProductList);
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
      if (
        updates[param] &&
        ((param === 'limit' && updates[param] !== 20) ||
          (param === 'sort' && updates[param] !== 'price_asc') ||
          (param !== 'limit' && param !== 'sort' && updates[param] !== ''))
      ) {
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
        renderCartModal();
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
  // URL이 변경되었을 때 해당 페이지까지 다시 로드
  loadProducts();
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
