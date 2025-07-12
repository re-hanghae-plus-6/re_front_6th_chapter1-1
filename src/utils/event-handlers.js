import { productListService, productDetailService, cartService } from "../services/index.js";
import { router } from "../routes/index.js";

/**
 * 토스트 메시지 표시 함수
 */
const showToastMessage = (message) => {
  // 기존 토스트 메시지가 있으면 제거
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) {
    existingToast.remove();
  }

  // 메시지 타입에 따른 토스트 생성
  const getToastHTML = (message) => {
    if (message === "장바구니에 추가되었습니다") {
      return `
        <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-sm font-medium">${message}</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
    } else if (message === "선택된 상품들이 삭제되었습니다") {
      return `
        <div class="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium">${message}</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
    } else {
      return `
        <div class="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-sm font-medium">${message}</p>
          <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
    }
  };

  // 새로운 토스트 메시지 생성
  const toast = document.createElement("div");
  toast.className = "toast-message flex flex-col gap-2 items-center justify-center mx-auto";
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: fit-content;
  `;
  toast.innerHTML = getToastHTML(message);

  // DOM에 추가
  document.body.appendChild(toast);

  // 닫기 버튼 이벤트 리스너
  const closeBtn = toast.querySelector("#toast-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (toast && toast.parentNode) {
        toast.remove();
      }
    });
  }

  // 3초 후 자동 제거
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove();
    }
  }, 3000);
};

/**
 * 검색 이벤트 핸들러
 */
export const handleSearchKeydown = async (e) => {
  if (e.target.id === "search-input" && e.key === "Enter") {
    await productListService.search(e.target.value);
  }
};

/**
 * 정렬 및 옵션 변경 이벤트 핸들러
 */
export const handleOptionChange = async (e) => {
  if (e.target.id === "sort-select") {
    await productListService.changeSort(e.target.value);
  }
  if (e.target.id === "limit-select") {
    await productListService.changeLimit(e.target.value);
  }
};

/**
 * 카테고리 및 브레드크럼 클릭 이벤트 핸들러
 */
export const handleCategoryClick = async (e) => {
  // 카테고리 1단계 필터
  if (e.target.classList.contains("category1-filter-btn")) {
    const category1 = e.target.dataset.category1;
    await productListService.changeCategory(category1);
    return;
  }

  // 카테고리 2단계 필터
  if (e.target.classList.contains("category2-filter-btn")) {
    const category1 = e.target.dataset.category1;
    const category2 = e.target.dataset.category2;
    await productListService.changeCategory(category1, category2);
    return;
  }

  // 브레드크럼 리셋
  if (e.target.dataset.breadcrumb === "reset") {
    await productListService.resetFilters();
    return;
  }

  // 브레드크럼 카테고리1 클릭
  if (e.target.dataset.breadcrumb === "category1") {
    const category1 = e.target.dataset.category1;
    await productListService.changeCategory(category1);
    return;
  }
};

/**
 * 상품 클릭 이벤트 핸들러 (상세페이지 이동)
 */
export const handleProductClick = (e) => {
  // 장바구니 버튼 클릭
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      if (productId) {
        // 상품 정보 가져오기
        const productTitle = productCard.querySelector("h3")?.textContent?.trim();
        const productBrand = productCard.querySelector("p")?.textContent?.trim();
        const productPrice = productCard.querySelector(".text-lg")?.textContent?.replace("원", "").replace(/,/g, "");
        const productImage = productCard.querySelector("img")?.src;

        if (productId && productTitle && productPrice) {
          const product = {
            productId,
            title: productTitle,
            brand: productBrand || "",
            lprice: productPrice,
            image: productImage || "",
          };

          cartService.addToCart(product);
          showToastMessage("장바구니에 추가되었습니다");
        }
      }
    }
    return;
  }

  // 상품 이미지 클릭
  if (e.target.classList.contains("product-image") || e.target.closest(".product-image")) {
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      if (productId) {
        router.navigate(`/product/${productId}`);
        return;
      }
    }
  }

  // 상품 정보 영역 클릭
  if (e.target.classList.contains("product-info") || e.target.closest(".product-info")) {
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      if (productId) {
        router.navigate(`/product/${productId}`);
        return;
      }
    }
  }
};

/**
 * 상품 상세 페이지 이벤트 핸들러
 */
export const handleProductDetailEvents = (e) => {
  // 수량 증가 버튼
  if (e.target.id === "quantity-increase" || e.target.closest("#quantity-increase")) {
    productDetailService.increaseQuantity();
    return;
  }

  // 수량 감소 버튼
  if (e.target.id === "quantity-decrease" || e.target.closest("#quantity-decrease")) {
    productDetailService.decreaseQuantity();
    return;
  }

  // 수량 입력 필드
  if (e.target.id === "quantity-input") {
    const quantity = parseInt(e.target.value) || 1;
    productDetailService.changeQuantity(quantity);
    return;
  }

  // 장바구니 추가 버튼
  if (e.target.id === "add-to-cart-btn") {
    const success = productDetailService.addToCart();
    if (success) {
      showToastMessage("장바구니에 추가되었습니다");
    }
    return;
  }

  // 관련 상품 클릭
  if (e.target.closest(".related-product-card")) {
    const productCard = e.target.closest(".related-product-card");
    const productId = productCard.dataset.productId;
    if (productId) {
      router.navigate(`/product/${productId}`);
    }
    return;
  }

  // 상품 목록으로 돌아가기
  if (e.target.classList.contains("go-to-product-list")) {
    router.navigate("/");
    return;
  }

  // 브레드크럼 클릭
  if (e.target.classList.contains("breadcrumb-link")) {
    if (e.target.dataset.category1 && e.target.dataset.category2) {
      router.navigate(`/?category1=${e.target.dataset.category1}&category2=${e.target.dataset.category2}`);
    } else if (e.target.dataset.category1) {
      router.navigate(`/?category1=${e.target.dataset.category1}`);
    }
    return;
  }
};

/**
 * 무한 스크롤 이벤트 핸들러
 */
export const handleInfiniteScroll = async () => {
  // 홈 페이지에서만 무한 스크롤 활성화
  if (router.getCurrentPath() !== "/") {
    return;
  }

  // 페이지 하단 근처 도달 시 다음 페이지 로드
  const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;

  if (isNearBottom) {
    await productListService.loadNextPage();
  }
};

/**
 * 장바구니 이벤트 핸들러
 */
export const handleCartEvents = (e) => {
  // 장바구니 아이콘 클릭
  if (e.target.id === "cart-icon-btn" || e.target.closest("#cart-icon-btn")) {
    cartService.openModal();
    return;
  }

  // 장바구니 모달 닫기 버튼
  if (e.target.id === "cart-modal-close-btn" || e.target.closest("#cart-modal-close-btn")) {
    cartService.closeModal();
    return;
  }

  // 장바구니 모달 배경 클릭
  if (e.target.classList.contains("cart-modal-overlay")) {
    cartService.closeModal();
    return;
  }

  // 전체 선택 체크박스
  if (e.target.id === "cart-modal-select-all-checkbox") {
    cartService.toggleSelectAll();
    return;
  }

  // 개별 상품 체크박스
  if (e.target.classList.contains("cart-item-checkbox")) {
    const productId = e.target.dataset.productId;
    cartService.toggleItemSelection(productId);
    return;
  }

  // 수량 증가 버튼
  if (e.target.classList.contains("quantity-increase-btn") || e.target.closest(".quantity-increase-btn")) {
    const productId = e.target.dataset.productId || e.target.closest(".quantity-increase-btn").dataset.productId;
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    if (quantityInput) {
      const newQuantity = parseInt(quantityInput.value) + 1;
      cartService.updateQuantity(productId, newQuantity);
    }
    return;
  }

  // 수량 감소 버튼
  if (e.target.classList.contains("quantity-decrease-btn") || e.target.closest(".quantity-decrease-btn")) {
    const productId = e.target.dataset.productId || e.target.closest(".quantity-decrease-btn").dataset.productId;
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    if (quantityInput) {
      const newQuantity = Math.max(1, parseInt(quantityInput.value) - 1);
      cartService.updateQuantity(productId, newQuantity);
    }
    return;
  }

  // 상품 개별 삭제
  if (e.target.classList.contains("cart-item-remove-btn")) {
    const productId = e.target.dataset.productId;
    cartService.removeFromCart(productId);
    showToastMessage("상품이 삭제되었습니다");
    return;
  }

  // 선택 상품 삭제
  if (e.target.id === "cart-modal-remove-selected-btn") {
    cartService.removeSelectedItems();
    showToastMessage("선택된 상품들이 삭제되었습니다");
    return;
  }

  // 장바구니 전체 비우기
  if (e.target.id === "cart-modal-clear-cart-btn") {
    cartService.clearCart();
    showToastMessage("장바구니가 비워졌습니다");
    return;
  }

  // 장바구니 상품 이미지/제목 클릭 (상세페이지 이동)
  if (e.target.classList.contains("cart-item-image") || e.target.classList.contains("cart-item-title")) {
    const productId = e.target.dataset.productId;
    if (productId) {
      cartService.closeModal();
      router.navigate(`/product/${productId}`);
    }
    return;
  }
};

/**
 * 수량 입력 필드 이벤트 핸들러
 */
export const handleCartQuantityInput = (e) => {
  if (e.target.classList.contains("quantity-input")) {
    const productId = e.target.dataset.productId;
    const quantity = parseInt(e.target.value) || 1;
    cartService.updateQuantity(productId, quantity);
  }
};

/**
 * ESC 키 이벤트 핸들러
 */
export const handleKeydown = (e) => {
  if (e.key === "Escape") {
    const cartState = cartService.getState();
    if (cartState.isModalOpen) {
      cartService.closeModal();
    }
  }
};
