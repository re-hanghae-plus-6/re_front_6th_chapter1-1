import { getProducts, getCategories } from "../api/productApi.js";
import Card from "../components/product-list/Card.js";
import Skeleton from "../components/product-list/Skeleton.js";
import { store } from "../store/store.js";
import SearchBox, { cleanupSearchBox, setupSearchBox } from "../components/product-list/SearchBox.js";
import { Header, initHeader } from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { getQueryParam } from "../utils/getQueryParam.js";
import {
  infiniteScroll,
  resetInfiniteScroll,
  loadMoreProducts,
  cleanupInfiniteScroll,
} from "../utils/infiniteScroll.js";
import { eventCartButtons } from "../components/product-list/Card.js";
// 모듈 스코프 변수들
const listStore = store;
let isLoading = false; // 중복 로딩 방지용 플래그
let subscribe = null;
// URL 파라미터에서 값을 안전하게 가져오는 함수
const fetchCategories = async () => {
  const response = await getCategories();
  return response;
};

const fetchProducts = async () => {
  const params = {
    limit: getQueryParam("limit", 20),
    sort: getQueryParam("sort", "price_asc"),
    page: getQueryParam("current", "1"),
    search: getQueryParam("search", ""),
    category1: getQueryParam("category1", ""),
    category2: getQueryParam("category2", ""),
  };

  // 빈 값들은 제거
  Object.keys(params).forEach((key) => {
    if (params[key] === "") {
      delete params[key];
    }
  });

  // 5초 타임아웃 추가

  const response = await getProducts(params);
  listStore.setPagination(response.pagination);
  return response.products;
};

const loadInitialData = async () => {
  // 이미 로딩 중이면 중복 실행 방지
  if (isLoading) {
    return;
  }

  isLoading = true;
  updateUI(); // 로딩 상태 UI 업데이트
  try {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
    listStore.setCategories(categories);
    listStore.setProducts(products);
    updateUI(); // 상품 로딩 완료 후 UI 업데이트
  } catch (e) {
    listStore.setError(e.message);
  } finally {
    isLoading = false;
    updateUI(); // 로딩 완료 UI 업데이트
  }
};

const loadProducts = async () => {
  // 이미 로딩 중이면 중복 실행 방지
  if (listStore.state.loading) {
    return;
  }

  try {
    // 로딩 상태 시작
    isLoading = true;
    updateUI(); // 로딩 상태 UI 업데이트

    const products = await fetchProducts();

    // Store에 데이터 저장 (이렇게 하면 UI가 자동 업데이트됨)
    listStore.setProducts(products);
    updateUI(); // 상품 로딩 완료 후 UI 업데이트

    // 무한스크롤 재설정 (검색/필터 변경 시)
    resetInfiniteScroll();
  } catch (e) {
    listStore.setError(e.message);
  } finally {
    isLoading = false;
    updateUI(); // 로딩 완료 UI 업데이트
  }
};

const updateUI = () => {
  const { state } = listStore;

  const gridEl = document.getElementById("products-grid");
  const loadingEl = document.getElementById("loading-text");

  // DOM 요소가 아직 준비되지 않았다면 재시도
  if (!gridEl || !loadingEl) {
    setTimeout(() => updateUI(), 100);
    return;
  }

  if (listStore.state.loading) {
    gridEl.innerHTML = Skeleton({ count: 10 });
    loadingEl.textContent = "상품을 불러오는 중...";

    // 로딩 중에는 상품 개수 요소 제거
    const countEl = document.getElementById("product-count");
    if (countEl) {
      countEl.remove();
    }
    return;
  } else {
    // products가 배열인지 확인하고, 아니면 빈 배열로 초기화
    const products = Array.isArray(state.products) ? state.products : [];
    const productCards = products.map((product) => Card({ product })).join("");

    gridEl.innerHTML = productCards;
    loadingEl.textContent = "상품을 불러오는 중...";

    // 로딩 완료 후 상품 개수 요소 생성
    let countEl = document.getElementById("product-count");
    if (!countEl) {
      countEl = document.createElement("div");
      countEl.id = "product-count";
      countEl.className = "mb-4 text-sm text-gray-600";
      gridEl.parentNode.insertBefore(countEl, gridEl);
    }
    // console.log(state.pagination);
    countEl.innerHTML = `총 <span class="font-medium text-gray-900">${state.pagination.total}개</span>의 상품`;
  }

  if (window.loadFlag && !listStore.state.isLoading) {
    const products = Array.isArray(state.products) ? state.products : [];
    if (products.length === 20) {
      setTimeout(() => {
        if (window.loadMoreProducts) {
          window.loadMoreProducts();
        }
      }, 2000);
    }
  }
};
const setupEventListeners = () => {
  // 상품 카드 클릭 이벤트 (상세 페이지 이동)
  const productGridEl = document.getElementById("products-grid");
  if (productGridEl) {
    productGridEl.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart-btn")) {
        return;
      }
      const productCard = e.target.closest(".product-card");
      if (productCard) {
        const productId = productCard.dataset.productId;
        window.router.navigate(`/product/${productId}`, { replace: false });
      }
    });
  }

  // 목록 새로고침 이벤트
  window.addEventListener("loadList", () => {
    loadProducts();
  });
};

function Home() {
  const setup = async () => {
    try {
      subscribe = store.subscribe(() => {
        updateUI();
      });

      // 초기 UI 렌더링
      updateUI();

      // SearchBox 초기화
      setupSearchBox();

      initHeader();
      eventCartButtons();
      // 초기 데이터 로딩
      await loadInitialData();

      window.loadMoreProducts = loadMoreProducts;
      // 이벤트 리스너 설정
      setupEventListeners();
      // DOM 렌더링 완료 후 무한 스크롤 초기화
      setTimeout(() => {
        infiniteScroll();
      }, 100);
    } catch (error) {
      console.error("Home 초기화 실패:", error);
      listStore.setError(error.message);
    }
  };

  const render = () => {
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50">
        ${Header()}
        <main class="max-w-md mx-auto px-4 py-4">
          ${SearchBox()}

          <div class="mb-6">
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
            <div class="text-center py-4 text-sm text-gray-500" id="loading-text"></div>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  };

  const cleanup = () => {
    // SearchBox 정리
    cleanupSearchBox();

    // 무한스크롤 정리
    cleanupInfiniteScroll();

    // 이벤트 리스너 정리
    window.removeEventListener("loadList", loadProducts);

    delete window.loadMoreProducts;
    delete window.triggerInfiniteScroll;
    delete window.forceLoadMore;

    // 로딩 상태 초기화
    store.reset();
    subscribe = store.unsubscribe(subscribe);
  };

  return {
    setup,
    cleanup,
    render,
  };
}

export default Home;
