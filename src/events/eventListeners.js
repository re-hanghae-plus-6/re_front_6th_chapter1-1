// 전역 이벤트 위임 방식 이벤트 리스너
import { productActions, productStore } from "../store/productStore.js";
import { cartActions } from "../store/cartStore.js";
import { loadProducts, loadMoreProducts } from "../pages/Home.js";

// 이벤트 위임 설정 - 앱 시작 시 한 번만 호출
export function setupGlobalEventListeners() {
  // document에 전역 이벤트 리스너 등록
  document.addEventListener("click", handleGlobalClick);
  document.addEventListener("input", handleGlobalInput);
  document.addEventListener("change", handleGlobalChange);
  document.addEventListener("keydown", handleGlobalKeydown);
  window.addEventListener("scroll", handleScroll);

  // 페이지 새로고침 감지
  window.addEventListener("beforeunload", () => {
    // 새로고침 감지용 (필요시 처리)
  });
}

// 전역 클릭 이벤트 처리
function handleGlobalClick(e) {
  const target = e.target;

  // 장바구니 담기 버튼 클릭 (상품 카드 클릭보다 먼저 처리)
  if (target.closest(".add-to-cart-btn")) {
    handleAddToCart(e);
    return;
  }

  // 상품 카드 클릭 (단, 장바구니 버튼이 아닌 경우만)
  if (target.closest(".product-card") && !target.closest(".add-to-cart-btn")) {
    handleProductClick(e);
    return;
  }

  // 관련 상품 카드 클릭
  if (target.closest(".related-product-card")) {
    handleRelatedProductClick(e);
    return;
  }

  // 수량 증가 버튼 클릭 (상품 상세 페이지)
  if (target.closest("#quantity-increase")) {
    handleQuantityIncrease(e);
    return;
  }

  // 수량 감소 버튼 클릭 (상품 상세 페이지)
  if (target.closest("#quantity-decrease")) {
    handleQuantityDecrease(e);
    return;
  }

  // 링크 클릭 (SPA 네비게이션)
  if (target.closest("[data-link]")) {
    handleSpaNavigation(e);
    return;
  }
}

// 전역 input 이벤트 처리
function handleGlobalInput(e) {
  const target = e.target;

  // 검색 입력
  if (target.matches("#search-input")) {
    handleSearchInput(e);
    return;
  }
}

// 전역 change 이벤트 처리
function handleGlobalChange(e) {
  const target = e.target;

  // 정렬 선택 변경
  if (target.matches("#sort-select")) {
    handleSortChange(e);
    return;
  }

  // 개수 선택 변경
  if (target.matches("#limit-select")) {
    handleLimitChange(e);
    return;
  }
}

// 전역 keydown 이벤트 처리
function handleGlobalKeydown(e) {
  const target = e.target;

  // 검색 입력에서 Enter 키 처리
  if (target.matches("#search-input") && e.key === "Enter") {
    handleSearchSubmit(e);
    return;
  }
}

// 개별 이벤트 핸들러들
function handleProductClick(e) {
  const productCard = e.target.closest(".product-card");
  if (!productCard) return;

  const productId = productCard.dataset.productId;

  // 라우터를 통해 상품 상세 페이지로 이동
  if (window.router) {
    window.router.navigate(`/product/${productId}`);
  }
}

function handleAddToCart(e) {
  e.preventDefault(); // 기본 동작 방지
  e.stopPropagation(); // 상품 카드 클릭 이벤트 방지
  e.stopImmediatePropagation(); // 다른 이벤트 리스너 실행 방지

  const productCard = e.target.closest(".product-card");
  if (!productCard) return;

  // 상품 정보 추출
  const product = extractProductFromCard(productCard);

  if (product) {
    // 장바구니에 추가
    cartActions.addToCart(product);
  }
}

function handleQuantityIncrease(e) {
  e.preventDefault();

  const quantityInput = document.getElementById("quantity-input");
  if (!quantityInput) return;

  const currentValue = parseInt(quantityInput.value) || 1;
  quantityInput.value = currentValue + 1;
}

function handleQuantityDecrease(e) {
  e.preventDefault();

  const quantityInput = document.getElementById("quantity-input");
  if (!quantityInput) return;

  const currentValue = parseInt(quantityInput.value) || 1;
  const newValue = Math.max(1, currentValue - 1); // 최소값 1
  quantityInput.value = newValue;
}

function handleRelatedProductClick(e) {
  const relatedProductCard = e.target.closest(".related-product-card");
  if (!relatedProductCard) return;

  const productId = relatedProductCard.dataset.productId;

  // 라우터를 통해 상품 상세 페이지로 이동
  if (window.router) {
    window.router.navigate(`/product/${productId}`);
  }
}

function handleSpaNavigation(e) {
  e.preventDefault();

  const link = e.target.closest("[data-link]");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href) return;

  // 라우터를 통해 페이지 이동
  if (window.router) {
    window.router.navigate(href);
  }
}

function handleSearchInput(e) {
  const searchValue = e.target.value.trim();

  // 디바운싱을 위한 타이머 처리 (Enter 키가 아닌 경우)
  clearTimeout(handleSearchInput.timer);
  handleSearchInput.timer = setTimeout(() => {
    executeSearch(searchValue);
  }, 300); // 300ms 후 실행
}

// Enter 키로 검색 실행
function handleSearchSubmit(e) {
  e.preventDefault();

  const searchValue = e.target.value.trim();

  // 타이머 클리어 후 즉시 검색
  clearTimeout(handleSearchInput.timer);
  executeSearch(searchValue);
}

// 검색 실행
function executeSearch(searchValue) {
  const currentFilters = productStore.getState().filters;

  // 검색어 업데이트
  productActions.updateFilters({
    ...currentFilters,
    search: searchValue,
  });

  // URL 업데이트
  updateUrlWithFilters({ ...currentFilters, search: searchValue });

  // 상품 로드
  loadProducts();
}

// URL에 필터 상태 반영
function updateUrlWithFilters(filters) {
  const url = new URL(window.location);
  const params = new URLSearchParams();

  // 기본값이 아닌 경우에만 URL에 추가
  if (filters.search && filters.search !== "") {
    params.set("search", filters.search);
  }

  if (filters.sort && filters.sort !== "price_asc") {
    params.set("sort", filters.sort);
  }

  // limit는 항상 URL에 포함
  params.set("limit", filters.limit || 20);

  // URL 업데이트
  const newUrl = `${url.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  window.history.replaceState(null, "", newUrl);
}

// 정렬 변경 핸들러
function handleSortChange(e) {
  const sortValue = e.target.value;
  const currentFilters = productStore.getState().filters;

  // 정렬 업데이트
  productActions.updateFilters({
    ...currentFilters,
    sort: sortValue,
  });

  // URL 업데이트
  updateUrlWithFilters({ ...currentFilters, sort: sortValue });

  // 상품 로드
  loadProducts();
}

// 개수 변경 핸들러
function handleLimitChange(e) {
  const limitValue = parseInt(e.target.value);
  const currentFilters = productStore.getState().filters;

  // 개수 업데이트
  productActions.updateFilters({
    ...currentFilters,
    limit: limitValue,
  });

  // URL 업데이트
  updateUrlWithFilters({ ...currentFilters, limit: limitValue });

  // 상품 로드
  loadProducts();
}

// 스크롤 이벤트 핸들러
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // 스크롤이 바닥에 도달했는지 확인 (100px 여유)
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    const state = productStore.getState();

    // 무한 스크롤 조건 확인
    if (!state.isLoading && !state.error && state.products.length < state.total) {
      // 무한 스크롤 플래그 설정
      window.isInfiniteScrolling = true;

      // 더 많은 상품 로드
      loadMoreProducts().finally(() => {
        // 무한 스크롤 플래그 해제
        window.isInfiniteScrolling = false;
      });
    }
  }
}

// 상품 카드에서 상품 정보 추출
function extractProductFromCard(productCard) {
  try {
    // 실제 DOM 구조에 맞는 선택자 사용
    const titleElement = productCard.querySelector("h3");
    const priceElement = productCard.querySelector(".text-lg.font-bold");
    const imageElement = productCard.querySelector("img");

    if (!titleElement || !priceElement || !imageElement) {
      console.warn("상품 정보 요소를 찾을 수 없습니다.");
      return null;
    }

    return {
      id: productCard.dataset.productId,
      title: titleElement.textContent.trim(),
      lprice: priceElement.textContent.replace(/[^0-9]/g, ""),
      image: imageElement.src,
    };
  } catch (error) {
    console.error("상품 정보 추출 중 오류 발생:", error);
    return null;
  }
}

// 이벤트 리스너 제거
export function removeGlobalEventListeners() {
  document.removeEventListener("click", handleGlobalClick);
  document.removeEventListener("input", handleGlobalInput);
  document.removeEventListener("change", handleGlobalChange);
  document.removeEventListener("keydown", handleGlobalKeydown);
  window.removeEventListener("scroll", handleScroll);
}
