import { productListService, productDetailService } from "../services/index.js";
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
  if (e.target.id === "quantity-increase") {
    const newQuantity = productDetailService.increaseQuantity();
    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      quantityInput.value = newQuantity;
    }
    return;
  }

  // 수량 감소 버튼
  if (e.target.id === "quantity-decrease") {
    const newQuantity = productDetailService.decreaseQuantity();
    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      quantityInput.value = newQuantity;
    }
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
