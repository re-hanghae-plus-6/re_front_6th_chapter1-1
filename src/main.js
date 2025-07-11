import { HomePage } from './pages/HomePage.js';
import { ProductDetail } from './pages/ProductDetail.js';
import { NotFound } from './pages/404.js';
import { getProducts, getCategories } from './api/productApi.js';
import { cart } from './pages/Cart.js';

const enableMocking = () =>
  import('./mocks/browser.js').then(({ worker, workerOptions }) =>
    worker.start(workerOptions),
  );

let state = {
  products: [],
  categories: [],
  total: 0,
  loading: false,
  error: null,
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
  const path = window.location.pathname;

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
    // 404 페이지
    currentPage = new NotFound();
    await currentPage.render();
  }
}

async function renderHomePage() {
  const urlState = getStateFromURL();
  state = { ...state, ...urlState };

  state.loading = true;
  state.error = null;
  render();

  try {
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
    state.error = null;
    render();

    setUpEventListeners();
    cart.init();
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    state.loading = false;
    state.error = '데이터를 불러오는 중 오류가 발생했습니다.';
    render();
    setUpEventListeners();
    cart.init();
  }
}

async function retryLoadData() {
  await renderHomePage();
}

function render() {
  document.body.querySelector('#root').innerHTML = HomePage(state);
}

async function loadMoreProducts() {
  if (state.loading || !state.hasMore) return;

  state.loading = true;
  state.error = null;
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
    state.error = null;
    render();
  } catch (error) {
    console.error('추가 상품 로드 실패:', error);
    state.loading = false;
    state.error = '추가 상품을 불러오는 중 오류가 발생했습니다.';
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
        state.error = null;
        updateURL();
        render();

        try {
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
          state.error = null;
          render();
        } catch (error) {
          console.error('검색 실패:', error);
          state.loading = false;
          state.error = '검색 중 오류가 발생했습니다.';
          render();
        }
      }
    });

  document.body.querySelector('#root').addEventListener('click', async (e) => {
    if (e.target.id === 'retry-btn') {
      await retryLoadData();
      return;
    }

    if (
      e.target.matches('.product-image img') ||
      e.target.closest('.product-image')
    ) {
      const productCard = e.target.closest('.product-card');
      if (productCard) {
        const productId = productCard.dataset.productId;
        if (productId) {
          window.history.pushState({}, '', `/product/${productId}`);
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
      state.error = null;
      updateURL();
      render();

      try {
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
        state.error = null;
        render();
      } catch (error) {
        console.error('카테고리 1depth 로드 실패:', error);
        state.loading = false;
        state.error = '카테고리를 불러오는 중 오류가 발생했습니다.';
        render();
      }
    }

    // 카테고리 2depth 선택
    if (e.target.dataset.category2) {
      const selectedCategory2 = e.target.dataset.category2;
      state.category2 = selectedCategory2;
      state.page = 1;
      state.loading = true;
      state.error = null;
      updateURL();
      render();

      try {
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
        state.error = null;
        render();
      } catch (error) {
        console.error('카테고리 2depth 로드 실패:', error);
        state.loading = false;
        state.error = '카테고리를 불러오는 중 오류가 발생했습니다.';
        render();
      }
    }

    // 브레드크럼 클릭
    if (e.target.dataset.breadcrumb === 'reset') {
      state.category1 = '';
      state.category2 = '';
      state.page = 1;
      state.loading = true;
      state.error = null;
      updateURL();
      render();

      try {
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
        state.error = null;
        render();
      } catch (error) {
        console.error('브레드크럼 리셋 로드 실패:', error);
        state.loading = false;
        state.error = '브레드크럼을 불러오는 중 오류가 발생했습니다.';
        render();
      }
    }

    if (e.target.dataset.breadcrumb === 'category1') {
      state.category2 = ''; // 2depth만 초기화
      state.page = 1;
      state.loading = true;
      state.error = null;
      updateURL();
      render();

      try {
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
        state.error = null;
        render();
      } catch (error) {
        console.error('카테고리 1depth 로드 실패:', error);
        state.loading = false;
        state.error = '카테고리를 불러오는 중 오류가 발생했습니다.';
        render();
      }
    }
  });

  document.body.querySelector('#root').addEventListener('change', async (e) => {
    if (e.target.id === 'limit-select') {
      const newLimit = parseInt(e.target.value);
      state.limit = newLimit;
      state.page = 1;
      state.loading = true;
      state.error = null;
      updateURL();
      render();

      try {
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
        state.error = null;
        render();
      } catch (error) {
        console.error('제한 로드 실패:', error);
        state.loading = false;
        state.error = '제한을 불러오는 중 오류가 발생했습니다.';
        render();
      }
    }
    if (e.target.id === 'sort-select') {
      const newSort = e.target.value;
      state.sort = newSort;
      state.page = 1;
      state.loading = true;
      state.error = null;
      updateURL();
      render();

      try {
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
        state.error = null;
        render();
      } catch (error) {
        console.error('정렬 로드 실패:', error);
        state.loading = false;
        state.error = '정렬을 불러오는 중 오류가 발생했습니다.';
        render();
      }
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
