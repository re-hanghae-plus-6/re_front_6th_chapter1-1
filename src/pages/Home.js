import { getProducts, getCategories } from "../api/productApi.js";
import Card from "../components/product-list/Card.js";
import Skeleton from "../components/product-list/Skeleton.js";
import { store } from "../store/store.js";
import SearchBox, { cleanupSearchBox, setupSearchBox } from "../components/product-list/SearchBox.js";
import { Header } from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { getQueryParam } from "../utils/getQueryParam.js";
import { infiniteScroll, resetInfiniteScroll, cleanupInfiniteScroll } from "../utils/infiniteScroll.js";

// 모듈 스코프 변수들
const listStore = store;
let unsubscribe = null;

// URL 파라미터에서 값을 안전하게 가져오는 함수
const fetchProducts = async () => {
  const params = {
    limit: getQueryParam("limit", "20"),
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

  const response = await getProducts(params);
  return response.products;
};

const fetchCategories = async () => {
  const response = await getCategories();
  return response;
};

const loadInitialData = async () => {
  try {
    listStore.setLoading(true);

    // 1. 카테고리를 먼저 빠르게 로딩
    const categories = await fetchCategories();
    listStore.setCategories(categories);

    // 2. 그 다음에 상품 로딩 (이때 이미 카테고리는 완료)
    const products = await fetchProducts();
    listStore.setProducts(products);
  } catch (e) {
    listStore.setError(e.message);
  } finally {
    listStore.setLoading(false);
  }
};

const loadProducts = async () => {
  try {
    // 로딩 상태 시작
    listStore.setLoading(true);

    const products = await fetchProducts();

    // Store에 데이터 저장 (이렇게 하면 UI가 자동 업데이트됨)
    listStore.setProducts(products);

    // 무한스크롤 재설정 (검색/필터 변경 시)
    resetInfiniteScroll();
  } catch (e) {
    console.error("❌ 에러:", e);
    listStore.setError(e.message);
  }
};

const updateUI = (state) => {
  const gridEl = document.getElementById("products-grid");
  const loadingEl = document.getElementById("loading-text");

  if (state.loading) {
    gridEl.innerHTML = Skeleton({ count: 10 });
    loadingEl.textContent = "상품을 불러오는 중...";

    // 로딩 중에는 상품 개수 요소 제거
    const countEl = document.getElementById("product-count");
    if (countEl) {
      countEl.remove();
    }
  } else if (state.error) {
    gridEl.innerHTML = `<div class="col-span-2 text-center text-red-600">상품을 불러오는데 실패했습니다.</div>`;
  } else {
    const productCards = state.products.map((product) => Card({ product })).join("");
    gridEl.innerHTML = productCards;
    loadingEl.textContent = "모든 상품을 확인했습니다";

    // 로딩 완료 후 상품 개수 요소 생성
    let countEl = document.getElementById("product-count");
    if (!countEl) {
      countEl = document.createElement("div");
      countEl.id = "product-count";
      countEl.className = "mb-4 text-sm text-gray-600";
      gridEl.parentNode.insertBefore(countEl, gridEl);
    }
    countEl.innerHTML = `총 <span class="font-medium text-gray-900">${state.products.length}개</span>의 상품`;
  }
};

const setupEventListeners = () => {
  // 상품 카드 클릭 이벤트 (상세 페이지 이동)
  const productGridEl = document.getElementById("products-grid");
  if (productGridEl) {
    productGridEl.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      if (productCard) {
        const productId = productCard.dataset.productId;
        window.router.navigate(`/product/${productId}`);
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
      // 스토어 구독
      unsubscribe = listStore.subscribe(updateUI);
      updateUI({ ...listStore.state, loading: true });

      // SearchBox 초기화
      setupSearchBox();

      // 초기 데이터 로딩
      await loadInitialData();

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
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">${Skeleton({ count: 10 })}</div>
            <div class="text-center py-4 text-sm text-gray-500" id="loading-text">상품을 불러오는 중...</div>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  };

  const cleanup = () => {
    // 구독 해제
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    // SearchBox 정리
    cleanupSearchBox();

    // 무한스크롤 정리
    cleanupInfiniteScroll();

    // 이벤트 리스너 정리
    window.removeEventListener("loadList", loadProducts);
  };

  return {
    setup,
    cleanup,
    render,
  };
}

export default Home;
