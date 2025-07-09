import { showToast } from "./components/Toast.js";
import { router } from "./router/index.js";
import { MainPage } from "./pages/MainPage.js";
import { Footer } from "./pages/Footer.js";
import { cartStore, productStore, categoryStore, storeManager, getAppState } from "./stores/index.js";

// MSW 초기화 상태 관리
let mswReady = false;
const mswReadyPromise = new Promise((resolve) => {
  window.mswResolve = resolve;
});

const enableMocking = async () => {
  try {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    mswReady = true;
    window.mswResolve && window.mswResolve();
    return true;
  } catch (error) {
    console.error("MSW 초기화 실패:", error);
    return false;
  }
};

// MSW 준비 상태 확인 함수
export function isMSWReady() {
  return mswReady;
}

// MSW 준비까지 기다리는 함수
export function waitForMSW() {
  if (mswReady) {
    return Promise.resolve();
  }
  return mswReadyPromise;
}

// Store 기반 렌더링 함수
function render() {
  const path = window.location.pathname;
  const root = document.getElementById("root");

  // store에서 현재 상태 가져오기
  const appState = getAppState();

  // 메인 페이지는 상태와 함께 렌더링
  if (path === "/") {
    root.innerHTML = `
      ${MainPage(appState)}
      ${Footer()}
    `;
  } else {
    // 다른 경로는 router로 처리
    router();
  }

  // SPA 내비게이션 처리
  document.querySelectorAll("a[data-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      window.history.pushState({}, "", href);
      render();
    });
  });

  // 쇼핑몰 로고/제목 클릭 시 초기 상태로 리셋
  const shopTitle = document.querySelector("h1 a[data-link]");
  if (shopTitle) {
    shopTitle.addEventListener("click", (e) => {
      e.preventDefault();
      // store를 통한 상태 초기화
      storeManager.resetAll();
      // 새로 데이터 로드
      storeManager.initialize();
      // 페이지 최상단으로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 장바구니 개수 뱃지 업데이트
  updateCartCountBadge();

  // select DOM이 다시 생성되므로 여기서 이벤트 등록
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", (e) => {
      storeManager.changeLimit(Number(e.target.value));
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      storeManager.changeSorting(e.target.value);
    });
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        storeManager.searchProducts(e.target.value);
      }
    });
  }

  // 장바구니 담기 버튼 이벤트 등록
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      try {
        const productId = btn.getAttribute("data-product-id");

        // 상품 ID 유효성 검사
        if (!productId) {
          showToast("error");
          return;
        }

        // cartStore를 통한 장바구니 추가
        cartStore.addItem(productId, 1);
        showToast("add");
        updateCartCountBadge();
      } catch (error) {
        console.error("장바구니 담기 중 오류 발생:", error);
        showToast("error");
      }
    });
  });

  // 카테고리 버튼 이벤트 등록
  document.querySelectorAll(".category1-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category1 = btn.getAttribute("data-category1");
      storeManager.selectCategory1(category1);
    });
  });

  document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category1 = btn.getAttribute("data-category1");
      const category2 = btn.getAttribute("data-category2");
      storeManager.selectCategory2(category1, category2);
    });
  });

  document.querySelectorAll("[data-breadcrumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-breadcrumb");
      if (action === "reset") {
        storeManager.resetCategory();
      } else if (action === "category1") {
        const category1 = btn.getAttribute("data-category1");
        storeManager.selectCategory1(category1);
      }
    });
  });

  // 무한 스크롤 이벤트 리스너 (메인 페이지에서만, 한 번만 등록)
  if (!window.scrollHandlerAdded) {
    window.addEventListener("scroll", () => {
      // 메인 페이지가 아니면 무한 스크롤 비활성화
      const path = window.location.pathname;
      const currentAppState = getAppState();
      if (path !== "/" || currentAppState.products.loading || !currentAppState.products.hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        storeManager.loadMoreProducts();
      }
    });
    window.scrollHandlerAdded = true;
  }
}

// 장바구니 개수 뱃지 표시 함수 (cartStore 기반)
function updateCartCountBadge() {
  const cartBtn = document.getElementById("cart-icon-btn");
  if (!cartBtn) return;

  const uniqueProductCount = cartStore.getUniqueProductCount();

  // 기존 뱃지 찾기
  let badge = cartBtn.querySelector(".cart-badge");

  if (uniqueProductCount > 0) {
    // 뱃지가 없으면 생성, 있으면 재사용
    if (!badge) {
      badge = document.createElement("span");
      badge.className =
        "cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
      cartBtn.appendChild(badge);
    }
    badge.textContent = uniqueProductCount;
  } else {
    // 장바구니가 비어있으면 뱃지 제거
    if (badge) {
      badge.remove();
    }
  }
}

// Store 변화 구독 및 렌더링
function setupStoreSubscriptions() {
  // 모든 store 변화 시 렌더링
  [cartStore, categoryStore, productStore].forEach((store) => {
    store.subscribe(() => {
      render();
    });
  });
}

// 앱 시작
async function startApp() {
  // MSW 초기화 (테스트 환경이 아닌 경우)
  if (import.meta.env.MODE !== "test") {
    await enableMocking();
  } else {
    // 테스트 환경에서는 MSW 준비 상태로 설정
    mswReady = true;
    window.mswResolve && window.mswResolve();
  }

  // store 구독 설정
  setupStoreSubscriptions();

  // store 매니저를 통한 앱 초기화
  await storeManager.initialize();

  // 초기 렌더링
  render();

  // popstate 이벤트 리스너 추가 (브라우저 뒤로가기/앞으로가기 및 테스트에서 사용)
  window.addEventListener("popstate", async () => {
    // 스크롤 이벤트 리스너 초기화
    window.scrollHandlerAdded = false;

    // store 매니저를 통한 재초기화
    await storeManager.initialize();
  });
}

startApp();
