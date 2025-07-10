import { productListService, productDetailService } from "../services/index.js";
import { router } from "../routes/index.js";

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
      // TODO: 토스트 메시지 표시
      console.log("장바구니에 추가되었습니다");
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
