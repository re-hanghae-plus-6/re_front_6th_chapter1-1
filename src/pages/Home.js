import { getProducts } from "../api/productApi.js";
import Card from "../components/product-list/Card.js";
import Skeleton from "../components/product-list/Skeleton.js";
import { store } from "../store/store.js";

import SearchBox, { cleanupSearchBox, setupSearchBox } from "../components/product-list/SearchBox.js";
import { Header } from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { getQueryParam } from "../utils/getQueryParam.js";
import { infiniteScroll, resetInfiniteScroll, cleanupInfiniteScroll } from "../utils/infiniteScroll.js";

const listStore = store;

// URL 파라미터에서 값을 안전하게 가져오는 함수
async function fetchProducts() {
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
}

let unsubscribe = null;
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
  const countEl = document.getElementById("product-count");

  if (state.loading) {
    gridEl.innerHTML = Skeleton({ count: 10 });
    loadingEl.textContent = "상품을 불러오는 중...";
    countEl.textContent = "";
  } else if (state.error) {
    gridEl.innerHTML = /*HTML*/ `
    <div class="col-span-2 text-center text-red-600">상품을 불러오는데 실패했습니다.</div>
    `;
    countEl.textContent = "";
  } else {
    const productCards = state.products.map((product) => Card({ product })).join("");
    gridEl.innerHTML = productCards;
    loadingEl.textContent = "모든 상품을 확인했습니다";
    countEl.innerHTML = `총 <span class="font-medium text-gray-900">${state.products.length}개</span>의 상품`;
  }
};

const Home = {
  render() {
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50">
        ${Header()}
        <main class="max-w-md mx-auto px-4 py-4">
          ${SearchBox(listStore)}

          <div class="mb-6">
            <div class="mb-4 text-sm text-gray-600" id="product-count"></div>
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">${Skeleton({ count: 10 })}</div>
            <div class="text-center py-4 text-sm text-gray-500" id="loading-text">상품을 불러오는 중...</div>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  },
  // 페이지 진입시
  setup() {
    unsubscribe = listStore.subscribe(updateUI);
    updateUI({ ...listStore.state, loading: true });
    setupSearchBox();

    window.addEventListener("loadList", () => {
      loadProducts();
    });

    loadProducts();
    // DOM 렌더링 완료 후 무한 스크롤 초기화
    setTimeout(() => {
      infiniteScroll();
    }, 100); // 100ms 지연
  },
  cleanup() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    cleanupSearchBox();
    cleanupInfiniteScroll();
  },
};

export default Home;
