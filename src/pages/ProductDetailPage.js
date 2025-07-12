import { ProductDetailUI } from "../views/PrudctDetailUI.js";
import { getProduct } from "../api/productApi.js";
import { showToast } from "../components/Toast.js";
import { getProducts } from "../api/productApi.js";

export const ProductDetailPage = ({ state, setState, addToCart, openCartModal, navigateTo }) => {
  const pageInstance = {};

  const createPage = async (params) => {
    setState({ loading: true });
    const productRes = await getProduct(params.productId);
    setState({ product: productRes, loading: false, relatedProducts: null });
    fetchRelatedProducts({ category1: productRes.category1, category2: productRes.category2 });
  };
  const render = () => {
    const root = document.getElementById("root");
    root.innerHTML = ProductDetailUI(state);
    bindProductDetailEvents();
  };

  const fetchRelatedProducts = async ({ category1, category2 }) => {
    const relatedProductRes = await getProducts({ category1, category2 });
    const exceptCurProduct = relatedProductRes.products.filter(
      (product) => product.productId !== state.product.productId,
    );
    setState({ relatedProducts: exceptCurProduct });
  };
  const bindProductDetailEvents = () => {
    // 관련 상품 클릭
    const productItems = document.querySelectorAll(".related-product-card");
    productItems.forEach((item) => {
      item.onclick = (e) => {
        const productId = e.target.closest(".related-product-card").getAttribute("data-product-id");
        onProductClick(productId);
      };
    });

    // 수량 증가 버튼 클릭
    const quantityIncreaseButton = document.getElementById("quantity-increase");
    if (quantityIncreaseButton) {
      quantityIncreaseButton.onclick = onQuantityIncreaseClick;
    }

    // 수량 감소 버튼 클릭
    const quantityDecreaseButton = document.getElementById("quantity-decrease");
    if (quantityDecreaseButton) {
      quantityDecreaseButton.onclick = onQuantityDecreaseClick;
    }

    // 장바구니 담기 버튼
    const addToCartButton = document.getElementById("add-to-cart-btn");
    if (addToCartButton) {
      addToCartButton.onclick = onAddToCartClick;
    }

    // 상품 목록으로 돌아가기 버튼
    const goToProductListButton = document.getElementById("go-to-product-list");
    if (goToProductListButton) {
      goToProductListButton.onclick = onGoToProductListClick;
    }
    // 장바구니 아이콘 버튼
    const cartIconBtn = document.getElementById("cart-icon-btn");
    if (cartIconBtn) {
      cartIconBtn.onclick = () => {
        openCartModal();
      };
    }
  };

  // 관련 상품 클릭
  const onProductClick = (productId) => {
    navigateTo(`/product/${productId}`);
  };
  //장바구니 추가 버튼 클릭 TODO: 수량도 같이 들어가야함
  const onAddToCartClick = (productId) => {
    const quantityInput = document.getElementById("quantity-input");
    const quantity = parseInt(quantityInput.value);
    addToCart({ productId, quantity });
    showToast("장바구니에 추가되었습니다");
  };
  //수량 증가 버튼 클릭
  const onQuantityIncreaseClick = () => {
    const quantityInput = document.getElementById("quantity-input");
    quantityInput.value = parseInt(quantityInput.value) + 1;
  };
  //수량 감소 버튼 클릭
  const onQuantityDecreaseClick = () => {
    const quantityInput = document.getElementById("quantity-input");
    quantityInput.value = quantityInput.value > 1 ? parseInt(quantityInput.value) - 1 : 1;
  };

  //상품 목록으로 돌아가기 클릭
  const onGoToProductListClick = () => {
    navigateTo("/");
  };

  pageInstance.createPage = createPage;
  pageInstance.render = render;

  return pageInstance;
};

export default ProductDetailPage;
