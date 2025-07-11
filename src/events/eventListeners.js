// 전역 이벤트 위임 방식 이벤트 리스너
import { productActions } from "../store/productStore.js";
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

  // 상품 카드 클릭
  if (target.closest(".product-card")) {
    handleProductClick(e);
    return;
  }

  // 장바구니 담기 버튼 클릭
  if (target.closest(".add-to-cart-btn")) {
    handleAddToCart(e);
    return;
  }

  // 장바구니 아이콘 클릭
  if (target.closest("#cart-icon-btn")) {
    handleCartIconClick(e);
    return;
  }

  // 수량 증가 버튼 클릭
  if (target.closest(".quantity-increase-btn")) {
    handleQuantityIncrease(e);
    return;
  }

  // 수량 감소 버튼 클릭
  if (target.closest(".quantity-decrease-btn")) {
    handleQuantityDecrease(e);
    return;
  }

  // 장바구니 모달 닫기
  if (target.closest(".cart-modal-overlay") && target === target.closest(".cart-modal-overlay")) {
    handleCartModalClose(e);
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

  // 상품 상세 페이지로 이동
  window.history.pushState(null, "", `/product/${productId}`);
  // TODO: 라우터를 통한 페이지 렌더링 호출
}

function handleAddToCart(e) {
  e.stopPropagation(); // 상품 카드 클릭 이벤트 방지

  const productCard = e.target.closest(".product-card");
  if (!productCard) return;

  // const productId = productCard.dataset.productId;

  // TODO: 장바구니 추가 로직
  // cartActions.addToCart(productId);
}

function handleCartIconClick(e) {
  e.preventDefault();

  // TODO: 장바구니 모달 열기
  // cartActions.openCartModal();
}

function handleQuantityIncrease(e) {
  e.stopPropagation();

  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  // const productId = cartItem.dataset.productId;

  // TODO: 장바구니 수량 증가
  // cartActions.increaseQuantity(productId);
}

function handleQuantityDecrease(e) {
  e.stopPropagation();

  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  // const productId = cartItem.dataset.productId;

  // TODO: 장바구니 수량 감소
  // cartActions.decreaseQuantity(productId);
}

function handleCartModalClose() {
  // TODO: 장바구니 모달 닫기
  // cartActions.closeCartModal();
}

function handleSpaNavigation(e) {
  e.preventDefault();

  const link = e.target.closest("[data-link]");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href) return;

  // URL 변경
  window.history.pushState(null, "", href);

  // TODO: 라우터를 통한 페이지 렌더링 호출
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

  // 디바운싱 타이머 클리어
  clearTimeout(handleSearchInput.timer);

  // 즉시 검색 실행
  executeSearch(searchValue);
}

// 검색 실행 함수
function executeSearch(searchValue) {
  // 검색어 필터 업데이트
  productActions.updateFilters({ search: searchValue });

  // URL 쿼리 파라미터 업데이트
  updateUrlWithFilters({ search: searchValue });

  // 상품 재로드
  loadProducts();
}

// URL에 필터 상태 반영 (통합 함수)
function updateUrlWithFilters(filters) {
  const currentUrl = new URL(window.location);

  // 각 필터의 기본값 정의
  const defaults = {
    search: "",
    sort: "price_asc",
    limit: 20,
    category1: "",
    category2: "",
  };

  // 각 필터 처리
  Object.entries(filters).forEach(([key, value]) => {
    // 기본값과 다른 경우에만 URL에 추가
    if (value && value !== "" && value !== defaults[key]) {
      currentUrl.searchParams.set(key, value);
    } else {
      // 기본값이거나 빈 값인 경우 URL에서 제거
      currentUrl.searchParams.delete(key);
    }
  });

  // URL 업데이트 (히스토리에 추가하지 않고 현재 URL 변경)
  window.history.replaceState({}, "", currentUrl.toString());
}

function handleSortChange(e) {
  const sortValue = e.target.value;

  // 필터 업데이트
  productActions.updateFilters({ sort: sortValue });

  // URL 쿼리 파라미터 업데이트
  updateUrlWithFilters({ sort: sortValue });

  // 새로운 조건으로 상품 다시 로드
  loadProducts();
}

function handleLimitChange(e) {
  const limitValue = parseInt(e.target.value);

  // 필터 업데이트
  productActions.updateFilters({ limit: limitValue });

  // URL 쿼리 파라미터 업데이트
  updateUrlWithFilters({ limit: limitValue });

  // 새로운 조건으로 상품 다시 로드
  loadProducts();
}

function handleScroll() {
  // 라우터가 초기화되지 않았으면 무시
  if (!window.router) {
    return;
  }

  // 스크롤 이벤트에서는 preventDefault 사용하지 않음

  // 스크롤 이벤트 throttling
  if (handleScroll.isThrottled) return;

  handleScroll.isThrottled = true;
  setTimeout(() => {
    handleScroll.isThrottled = false;
  }, 100);

  // 스크롤 위치 확인
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 하단에서 100px 전에 도달했을 때 트리거
  const threshold = 100;

  if (scrollTop + windowHeight >= documentHeight - threshold) {
    // 홈 페이지에서만 무한 스크롤 동작하고, 상품 그리드가 존재할 때만
    if (window.location.pathname === "/" && document.getElementById("products-grid")) {
      // 이미 무한 스크롤 중이면 중복 실행 방지
      if (!window.isInfiniteScrolling) {
        loadMoreProducts();
      }
    }
  }
}

// 전역 이벤트 리스너 제거 (필요시 사용)
export function removeGlobalEventListeners() {
  document.removeEventListener("click", handleGlobalClick);
  document.removeEventListener("input", handleGlobalInput);
  document.removeEventListener("change", handleGlobalChange);
  document.removeEventListener("keydown", handleGlobalKeydown);
  window.removeEventListener("scroll", handleScroll);
}
