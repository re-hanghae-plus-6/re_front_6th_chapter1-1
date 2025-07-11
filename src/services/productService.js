import { getProduct } from "../api/productApi";
import { loadCartFromStorage, saveToStorage } from "./cartService";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const product = await getProduct(productId);
    const cart = loadCartFromStorage();

    const existingProduct = isProductInCart(cart, productId);

    if (existingProduct) {
      // 이미 장바구니에 있는 상품이면 수량만 증가
      existingProduct.quantity = (existingProduct.quantity || 1) + quantity;
      saveToStorage(cart);
      return { success: true, message: "장바구니에 추가되었습니다.", items: cart };
    }

    // 새로운 상품이면 수량 정보와 함께 추가
    const productWithQuantity = { ...product, quantity };
    saveToStorage([...cart, productWithQuantity]);

    console.log(cart);

    return { success: true, message: "장바구니에 추가되었습니다.", items: [...cart, productWithQuantity] };
  } catch (error) {
    console.error("장바구니 추가 중 오류 발생:", error);
    return { success: false, message: "장바구니 추가에 실패했습니다." };
  }
};

export const isProductInCart = (cart, productId) => {
  return cart.find((item) => item.productId === productId);
};

export const getProductsCountInCart = () => {
  const cart = loadCartFromStorage();
  console.log(cart);
  return cart.length;
};
