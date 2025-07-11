// 전역 이벤트 위임 방식 이벤트 리스너

// 이벤트 위임 설정 - 앱 시작 시 한 번만 호출
export function setupGlobalEventListeners() {
  console.log("전역 이벤트 위임 설정 중...");

  // document에 전역 이벤트 리스너 등록
  document.addEventListener("click", handleGlobalClick);
  document.addEventListener("input", handleGlobalInput);
  document.addEventListener("change", handleGlobalChange);

  console.log("전역 이벤트 위임 설정 완료");
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

// 개별 이벤트 핸들러들
function handleProductClick(e) {
  const productCard = e.target.closest(".product-card");
  if (!productCard) return;

  const productId = productCard.dataset.productId;
  console.log("상품 클릭:", productId);

  // 상품 상세 페이지로 이동
  window.history.pushState(null, "", `/product/${productId}`);
  // TODO: 라우터를 통한 페이지 렌더링 호출
}

function handleAddToCart(e) {
  e.stopPropagation(); // 상품 카드 클릭 이벤트 방지

  const productCard = e.target.closest(".product-card");
  if (!productCard) return;

  const productId = productCard.dataset.productId;
  console.log("장바구니 담기:", productId);

  // TODO: 장바구니 추가 로직
  // cartActions.addToCart(productId);
}

function handleCartIconClick(e) {
  e.preventDefault();
  console.log("장바구니 아이콘 클릭");

  // TODO: 장바구니 모달 열기
  // cartActions.openCartModal();
}

function handleQuantityIncrease(e) {
  e.stopPropagation();

  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  const productId = cartItem.dataset.productId;
  console.log("수량 증가:", productId);

  // TODO: 장바구니 수량 증가
  // cartActions.increaseQuantity(productId);
}

function handleQuantityDecrease(e) {
  e.stopPropagation();

  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  const productId = cartItem.dataset.productId;
  console.log("수량 감소:", productId);

  // TODO: 장바구니 수량 감소
  // cartActions.decreaseQuantity(productId);
}

function handleCartModalClose(e) {
  console.log("장바구니 모달 닫기", e);

  // TODO: 장바구니 모달 닫기
  // cartActions.closeCartModal();
}

function handleSpaNavigation(e) {
  e.preventDefault();

  const link = e.target.closest("[data-link]");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href) return;

  console.log("SPA 네비게이션:", href);

  // URL 변경
  window.history.pushState(null, "", href);

  // TODO: 라우터를 통한 페이지 렌더링 호출
}

function handleSearchInput(e) {
  const searchValue = e.target.value.trim();
  console.log("검색어 입력:", searchValue);

  // 디바운싱을 위한 타이머 처리
  clearTimeout(handleSearchInput.timer);
  handleSearchInput.timer = setTimeout(() => {
    // TODO: 나중에 구현
    console.log("검색 실행:", searchValue);
  }, 300); // 300ms 후 실행
}

function handleSortChange(e) {
  const sortValue = e.target.value;
  console.log("정렬 변경:", sortValue);

  // TODO: 나중에 구현
}

function handleLimitChange(e) {
  const limitValue = parseInt(e.target.value);
  console.log("개수 변경:", limitValue);

  // TODO: 나중에 구현 - 새로운 limit으로 상품 다시 로드
}

// 전역 이벤트 리스너 제거 (필요시 사용)
export function removeGlobalEventListeners() {
  document.removeEventListener("click", handleGlobalClick);
  document.removeEventListener("input", handleGlobalInput);
  document.removeEventListener("change", handleGlobalChange);
}
