import mainStore from "../store/main.js";
import { showSnackbar } from "../widgets/Snackbar.js";
import { ADD_TO_CART_SNACKBAR, ERROR_SNACKBAR } from "../constants/enum.js";
import { render } from "../core/renderer.js";
import { addToCart } from "../utils/cart.js";
import { loadProductDetail } from "../services/productDetailService.js";
import { getFullPath } from "../utils/path.js";

export const handleAddToCart = (e) => {
  // 클릭된 요소가 장바구니 추가 버튼인지 확인
  if (!e.target.classList.contains("add-to-cart-btn")) return;

  const productId = e.target.dataset.productId;

  if (productId === undefined) {
    showSnackbar(ERROR_SNACKBAR);
    return;
  }

  const selectedProduct = mainStore.getProducts().find((product) => product.productId === productId);

  if (!selectedProduct) {
    showSnackbar(ERROR_SNACKBAR);
    return;
  }

  // 장바구니에 상품 추가 (수량 자동 처리)
  const updatedCart = addToCart(selectedProduct);

  console.log("장바구니 업데이트:", updatedCart);

  // 스낵바 표시
  showSnackbar(ADD_TO_CART_SNACKBAR);

  render();
};

// 상세 페이지 진입 클릭 이벤트
export const handleProductDetailClick = (e) => {
  console.log("handleProductDetailClick", e.target.closest("#product-card"), e, e.target);

  const productCard = e.target.closest("#product-card");

  // 클릭된 요소가 상품 카드가 아닌 경우 무시
  if (!productCard) return;
  if (e.target.classList.contains("add-to-cart-btn")) return;

  console.log(productCard.dataset["productId"]);
  const productId = productCard.dataset.productId;

  if (productId) {
    // URL을 상품 상세 페이지로 변경 (BASE_PATH 고려)
    const productPath = getFullPath(`/product/${productId}`);
    window.history.pushState({}, "", productPath);

    // 상품 상세 정보 로드
    loadProductDetail(productId);
  } else {
    showSnackbar(ERROR_SNACKBAR);
  }
};
