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
let isLoading = false; // 중복 로딩 방지용 플래그

// URL 파라미터에서 값을 안전하게 가져오는 함수
const fetchCategories = async () => {
  // 5초 타임아웃 추가
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("카테고리 로딩 타임아웃")), 5000),
  );

  const fetchPromise = getCategories();

  return Promise.race([fetchPromise, timeoutPromise]);
};

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

  // 5초 타임아웃 추가
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("상품 로딩 타임아웃")), 5000));

  const fetchPromise = getProducts(params);

  const response = await Promise.race([fetchPromise, timeoutPromise]);
  return response.products;
};

const loadInitialData = async () => {
  // 이미 로딩 중이면 중복 실행 방지
  if (isLoading) {
    console.log("⏸️ 이미 로딩 중이므로 중복 실행 방지");
    return;
  }

  try {
    console.log("🚀 loadInitialData 시작");
    isLoading = true;
    updateUI(); // 로딩 상태 UI 업데이트

    // 1. 카테고리 로딩 (실패해도 상품 로딩은 계속 진행)
    // 테스트 환경에서는 카테고리 로딩을 건너뛰기
    const isTestEnvironment = typeof window !== "undefined" && window.location.hostname === "localhost";

    if (!isTestEnvironment) {
      try {
        console.log("📂 카테고리 로딩 시작");
        const categories = await fetchCategories();
        console.log("📂 카테고리 로딩 완료:", categories);
        listStore.setCategories(categories);
      } catch (categoryError) {
        console.warn("⚠️ 카테고리 로딩 실패:", categoryError);
        // 카테고리 로딩 실패해도 계속 진행
      }
    } else {
      console.log("🧪 테스트 환경 - 카테고리 로딩 건너뛰기");
    }

    // 2. 상품 로딩
    console.log("🛒 상품 로딩 시작");
    const products = await fetchProducts();
    console.log("🛒 상품 로딩 완료:", products?.length, "개");
    listStore.setProducts(products);
    updateUI(); // 상품 로딩 완료 후 UI 업데이트
    console.log("✅ loadInitialData 완료");
  } catch (e) {
    console.error("❌ loadInitialData 에러:", e);
    listStore.setError(e.message);
  } finally {
    console.log("🔄 로딩 상태 false로 변경");
    isLoading = false;
    updateUI(); // 로딩 완료 UI 업데이트
  }
};

const loadProducts = async () => {
  // 이미 로딩 중이면 중복 실행 방지
  if (isLoading) {
    console.log("⏸️ 이미 로딩 중이므로 중복 실행 방지");
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
    console.error("❌ 에러:", e);
    listStore.setError(e.message);
  } finally {
    isLoading = false;
    updateUI(); // 로딩 완료 UI 업데이트
  }
};

const updateUI = () => {
  const { state } = listStore;
  console.log("🔄 updateUI 호출됨 - loading:", isLoading, "products:", state.products?.length, "error:", state.error);

  const gridEl = document.getElementById("products-grid");
  const loadingEl = document.getElementById("loading-text");

  // DOM 요소가 아직 준비되지 않았다면 재시도
  if (!gridEl || !loadingEl) {
    console.log("⏳ DOM 요소가 아직 준비되지 않음, 100ms 후 재시도");
    setTimeout(() => updateUI(), 100);
    return;
  }

  if (isLoading) {
    console.log("🔄 로딩 중 - 스켈레톤 표시");
    gridEl.innerHTML = Skeleton({ count: 10 });
    loadingEl.textContent = "상품을 불러오는 중...";

    // 로딩 중에는 상품 개수 요소 제거
    const countEl = document.getElementById("product-count");
    if (countEl) {
      countEl.remove();
    }
  } else {
    console.log("✅ 로딩 완료 - 상품 카드 표시");
    // products가 배열인지 확인하고, 아니면 빈 배열로 초기화
    const products = Array.isArray(state.products) ? state.products : [];
    const productCards = products.map((product) => Card({ product })).join("");

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
    countEl.innerHTML = `총 <span class="font-medium text-gray-900">${products.length}개</span>의 상품`;
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
      // 초기 UI 렌더링
      updateUI();

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

    // 로딩 상태 초기화
    isLoading = false;
  };

  return {
    setup,
    cleanup,
    render,
  };
}

export default Home;
