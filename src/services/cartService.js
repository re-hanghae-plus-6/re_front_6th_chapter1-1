export const saveToStorage = (product) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("장바구니 저장 중 오류 발생:", error);
  }
};

export const loadCartFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("장바구니 로드 중 오류 발생:", error);
    return [];
  }
};
