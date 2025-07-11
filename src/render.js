import { MainPage } from "./pages/MainPage.js";
import { Footer } from "./pages/Footer.js";
import { Header } from "./pages/Header.js";
import { router } from "./router/index.js";
import { showToast } from "./components/Toast.js";
import { ProductItem } from "./components/ProductItem.js";
import { bindCartIconEvent } from "./components/CartModal.js";
import { cartStore, categoryStore, productStore, storeManager, getAppState } from "./stores/index.js";
import { getFullPath, getAppPath } from "./utils/pathUtils.js";

/**
 * 렌더링 초기화 - Store 변화 감지와 렌더링 설정
 */
export function initRender() {
  // 렌더링 비활성화 플래그
  let renderingDisabled = false;

  // 렌더링 비활성화/활성화 함수를 전역으로 노출
  window.disableRendering = () => {
    renderingDisabled = true;
  };
  window.enableRendering = () => {
    renderingDisabled = false;
    // render() 호출하지 않음 - 무한 루프 방지
  };
  window.enableRenderingAndRender = () => {
    renderingDisabled = false;
    render();
  };

  // 상세 페이지 체크 함수
  const isCurrentlyOnDetailPage = () => {
    const currentPath = getAppPath();
    return /^\/product\/\d+$/.test(currentPath);
  };

  // ProductStore 변화 시 특별 처리
  productStore.subscribe(() => {
    if (renderingDisabled) return;

    // 상세 페이지에서는 완전히 건너뛰기
    if (isCurrentlyOnDetailPage()) {
      return;
    }

    const state = productStore.getState();

    // 무한 스크롤로 새 상품이 로드된 경우
    if (state.newlyLoadedProducts.length > 0 && !state.isFirstLoad) {
      appendNewProducts();
    }
    // 그 외의 경우는 모두 전체 렌더링
    else {
      render();
    }
  });

  // 다른 store들은 일반 렌더링
  [cartStore, categoryStore].forEach((store, index) => {
    const storeName = index === 0 ? "CartStore" : "CategoryStore";
    store.subscribe(() => {
      if (renderingDisabled) return;

      // 상세 페이지에서는 CategoryStore는 완전히 건너뛰기, CartStore만 허용
      if (isCurrentlyOnDetailPage()) {
        if (storeName === "CategoryStore") {
          return;
        }
        // CartStore는 상세 페이지에서도 장바구니 뱃지 업데이트를 위해 허용하지만 render는 호출하지 않음

        return;
      }

      render();
    });
  });
}

/**
 * 메인 렌더링 함수
 */
export function render() {
  const appPath = getAppPath(); // 배포환경 서브디렉토리 경로 처리
  const root = document.getElementById("root");

  // store에서 현재 상태 가져오기 (상세 페이지에서는 건너뛰기)
  const isProductDetailPage = /^\/product\/\d+$/.test(appPath);
  let appState = null;

  if (!isProductDetailPage) {
    appState = getAppState();
  }

  // 페이지별 렌더링
  if (appPath === "/") {
    root.innerHTML = `
      ${Header()}
      ${MainPage(appState)}
      ${Footer()}
    `;
  } else {
    // 다른 경로는 router로 처리
    router();
  }

  // 렌더링 후 이벤트 바인딩
  bindEvents();
}

/**
 * 이벤트 바인딩 함수
 */
function bindEvents() {
  const appPath = getAppPath(); // 배포환경 서브디렉토리 경로 처리
  const isProductDetailPage = /^\/product\/\d+$/.test(appPath);

  // SPA 내비게이션 처리 (모든 페이지에서 필요)
  bindNavigationEvents();

  // 장바구니 개수 뱃지 업데이트 (모든 페이지에서 필요)
  updateCartCountBadge();

  // 장바구니 아이콘 이벤트 (모든 페이지에서 필요)
  bindCartIconEvent();

  // 상세 페이지에서는 아래 이벤트들 건너뛰기
  if (isProductDetailPage) {
    return;
  }

  // 홈 버튼 이벤트
  bindHomeButtonEvent(appPath);

  // 폼 컨트롤 이벤트
  bindFormEvents();

  // 상품 관련 이벤트
  bindProductEvents();

  // 카테고리 이벤트
  bindCategoryEvents();

  // 무한 스크롤 이벤트
  bindInfiniteScrollEvent();
}

/**
 * SPA 내비게이션 이벤트 바인딩
 */
function bindNavigationEvents() {
  document.querySelectorAll("a[data-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      const targetPath = href.replace(/^\/[^/]*\//, "/"); // 서브디렉토리 제거한 경로
      const isTargetDetailPage = /^\/product\/\d+$/.test(targetPath);

      window.history.pushState({}, "", getFullPath(href));

      // 상세 페이지로 이동하는 경우 렌더링 비활성화 후 라우터 호출
      if (isTargetDetailPage) {
        if (window.disableRendering) {
          window.disableRendering();
        }
        router(); // 직접 라우터 호출
      } else {
        // 일반 페이지는 기존대로 렌더링
        render();
      }
    });
  });
}

/**
 * 홈 버튼 이벤트 바인딩
 */
function bindHomeButtonEvent(appPath) {
  const shopTitle = document.querySelector("h1 a[data-link]");
  if (shopTitle) {
    shopTitle.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        // 현재 상태가 이미 초기 상태인지 확인 (상세 페이지가 아닐 때만)
        if (appPath === "/") {
          const currentAppState = getAppState();
          const isAlreadyInitialState =
            !currentAppState.selectedCategories.category1 &&
            !currentAppState.selectedCategories.category2 &&
            !currentAppState.products.search &&
            currentAppState.products.sort === "price_asc" &&
            currentAppState.products.limit === 20;

          // 이미 초기 상태라면 리셋하지 않음
          if (isAlreadyInitialState) {
            // 페이지 최상단으로 스크롤만 수행
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        }

        // store를 통한 상태 초기화
        window.disableRendering();
        storeManager.resetAll();
        // 새로 데이터 로드
        await storeManager.initialize();
        window.enableRenderingAndRender();
        // 페이지 최상단으로 스크롤
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        if (error instanceof Error) {
          window.enableRenderingAndRender();
        }
      }
    });
  }
}

/**
 * 폼 컨트롤 이벤트 바인딩
 */
function bindFormEvents() {
  // 페이지당 상품 수 선택
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", (e) => {
      storeManager.changeLimit(Number(e.target.value));
    });
  }

  // 정렬 선택
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      storeManager.changeSorting(e.target.value);
    });
  }

  // 검색 입력
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        storeManager.searchProducts(e.target.value);
      }
    });
  }
}

/**
 * 상품 관련 이벤트 바인딩
 */
function bindProductEvents() {
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
        if (error) {
          showToast("error");
        }
      }
    });
  });
}

/**
 * 카테고리 이벤트 바인딩
 */
function bindCategoryEvents() {
  // 1차 카테고리 버튼
  document.querySelectorAll(".category1-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category1 = btn.getAttribute("data-category1");
      storeManager.selectCategory1(category1);
    });
  });

  // 2차 카테고리 버튼
  document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category1 = btn.getAttribute("data-category1");
      const category2 = btn.getAttribute("data-category2");
      storeManager.selectCategory2(category1, category2);
    });
  });

  // 브레드크럼 버튼
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
}

/**
 * 무한 스크롤 이벤트 바인딩
 */
function bindInfiniteScrollEvent() {
  // 무한 스크롤 이벤트 리스너 (메인 페이지에서만, 한 번만 등록)
  if (!window.scrollHandlerAdded) {
    window.addEventListener("scroll", () => {
      // 메인 페이지가 아니면 무한 스크롤 비활성화
      const appPath = getAppPath(); // 배포환경 서브디렉토리 경로 처리

      // 상세 페이지에서는 무한 스크롤 완전 차단
      if (/^\/product\/\d+$/.test(appPath)) {
        return;
      }

      // 메인 페이지가 아니면 무한 스크롤 비활성화
      if (appPath !== "/") {
        return;
      }

      const currentAppState = getAppState();
      if (currentAppState.products.loading || !currentAppState.products.hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      );

      // 페이지 하단에 가까워지면 추가 상품 로드 (매우 민감하게)
      if (
        scrollTop + windowHeight >= documentHeight - 10 ||
        scrollTop + windowHeight >= document.body.scrollHeight - 10
      ) {
        storeManager.loadMoreProducts();
      }
    });
    window.scrollHandlerAdded = true;
  }
}

/**
 * 무한 스크롤 시 새로운 상품만 추가하는 함수
 */
export function appendNewProducts() {
  const newProducts = productStore.getAndClearNewlyLoadedProducts();

  if (newProducts.length === 0) return;

  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return;

  // 무한 스크롤 로딩 UI 제거
  const infiniteScrollLoading = document.getElementById("infinite-scroll-loading");
  if (infiniteScrollLoading) {
    infiniteScrollLoading.remove();
  }

  // 새로운 상품들을 기존 그리드에 추가
  const newProductsHTML = newProducts
    .map(
      (product) => `
    <a href="${getFullPath(`/product/${product.productId}`)}" data-link style="display:block;text-decoration:none;color:inherit;">
      ${ProductItem(product)}
    </a>
  `,
    )
    .join("");

  productsGrid.insertAdjacentHTML("beforeend", newProductsHTML);

  // 상품 개수 정보 업데이트
  updateProductCount();

  // 새로 추가된 상품들에 이벤트 바인딩
  bindProductEvents();
  bindNavigationEvents();
}

/**
 * 상품 개수 정보 업데이트 함수
 */
function updateProductCount() {
  const productState = productStore.getState();
  const productCountElement = document.getElementById("product-count");

  if (productCountElement) {
    productCountElement.innerHTML = `
      총 <span class="font-medium text-gray-900">${productState.total}개</span>의 상품
    `;
  }
}

/**
 * 장바구니 개수 뱃지 업데이트
 */
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
