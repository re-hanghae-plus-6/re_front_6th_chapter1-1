import mainStore from "../store/main.js";
import { loadProductDetail } from "../services/productDetailService.js";
import { addToCart } from "../utils/cart.js";
import { updateURL } from "../utils/url.js";
import { render } from "../core/renderer.js";

// 수량 증가 핸들러
export const handleQuantityIncrease = () => {
  const currentQuantity = mainStore.getSelectedQuantity();
  mainStore.setSelectedQuantity(currentQuantity + 1);

  // 수량 입력 필드 업데이트
  const quantityInput = document.getElementById("quantity-input");
  if (quantityInput) {
    quantityInput.value = currentQuantity + 1;
  }
};

// 수량 감소 핸들러
export const handleQuantityDecrease = () => {
  const currentQuantity = mainStore.getSelectedQuantity();
  if (currentQuantity > 1) {
    mainStore.setSelectedQuantity(currentQuantity - 1);

    // 수량 입력 필드 업데이트
    const quantityInput = document.getElementById("quantity-input");
    if (quantityInput) {
      quantityInput.value = currentQuantity - 1;
    }
  }
};

// 수량 직접 입력 핸들러
export const handleQuantityInput = (event) => {
  const value = parseInt(event.target.value);
  if (value && value > 0) {
    mainStore.setSelectedQuantity(value);
  } else {
    // 잘못된 값이면 1로 설정
    mainStore.setSelectedQuantity(1);
    event.target.value = 1;
  }
};

// 장바구니 담기 핸들러
export const handleAddToCartFromDetail = () => {
  const currentProduct = mainStore.getCurrentProduct();
  const quantity = mainStore.getSelectedQuantity();

  if (currentProduct) {
    addToCart(currentProduct.productId, quantity);
  }
};

// 관련 상품 클릭 핸들러
export const handleRelatedProductClick = async (productId) => {
  // URL 변경
  window.history.pushState({}, "", `/product/${productId}`);

  // 상품 상세 로드
  await loadProductDetail(productId);

  // 페이지 맨 위로 스크롤
  window.scrollTo(0, 0);
};

// 브레드크럼 카테고리 클릭 핸들러
export const handleBreadcrumbCategoryClick = (category) => {
  // 홈으로 돌아가면서 해당 카테고리 필터 적용
  const params = {
    category1: category,
    page: 1,
  };

  // URL 업데이트
  updateURL(params);

  // 상품 상세 상태 초기화
  mainStore.setCurrentProduct(null);
  mainStore.setRelatedProducts([]);

  // 필터 파라미터 설정
  mainStore.setParams(params);

  // 홈 페이지로 이동하면서 해당 카테고리 상품들 로드
  window.history.pushState({}, "", `/?category1=${encodeURIComponent(category)}`);

  // 페이지 새로고침 대신 상품 목록 재로딩
  import("../services/productService.js").then(({ updateProducts }) => {
    updateProducts(params);
  });
};

// 홈으로 돌아가기 핸들러
export const handleGoHome = () => {
  // 상품 상세 상태 초기화
  mainStore.setCurrentProduct(null);
  mainStore.setRelatedProducts([]);

  // 홈으로 이동
  window.history.pushState({}, "", "/");

  // 홈 페이지 렌더링
  render();
};

// 상품 상세 페이지 이벤트 리스너 설정
export const setupProductDetailEventListeners = () => {
  // 수량 조절 버튼 (현재 ProductDetailPage.js의 ID 사용)
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");
  const quantityInput = document.getElementById("quantity-input");

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", handleQuantityDecrease);
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", handleQuantityIncrease);
  }

  if (quantityInput) {
    quantityInput.addEventListener("input", handleQuantityInput);
  }

  // 장바구니 담기 버튼
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", handleAddToCartFromDetail);
  }

  // 관련 상품 클릭 이벤트 (현재 클래스명 사용)
  const relatedProductElements = document.querySelectorAll(".related-product-card");
  relatedProductElements.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = element.dataset.productId;
      if (productId) {
        handleRelatedProductClick(productId);
      }
    });
  });

  // 브레드크럼 클릭 이벤트 (현재 클래스명 사용)
  const categoryBreadcrumbs = document.querySelectorAll(".breadcrumb-link");
  categoryBreadcrumbs.forEach((breadcrumb) => {
    breadcrumb.addEventListener("click", (e) => {
      e.preventDefault();
      const category1 = breadcrumb.dataset.category1;
      const category2 = breadcrumb.dataset.category2;
      const category = category1 || category2;
      if (category) {
        handleBreadcrumbCategoryClick(category);
      }
    });
  });

  // 홈 링크 클릭 이벤트 (data-link 속성을 가진 a 태그)
  const homeLink = document.querySelector('a[data-link=""]');
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoHome();
    });
  }

  // 상품 목록으로 돌아가기 버튼
  const goToProductListBtn = document.querySelector(".go-to-product-list");
  if (goToProductListBtn) {
    goToProductListBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoHome();
    });
  }

  // 홈으로 돌아가기 버튼 (상품이 없을 때)
  const goHomeButton = document.getElementById("go-home-button");
  if (goHomeButton) {
    goHomeButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoHome();
    });
  }
};
