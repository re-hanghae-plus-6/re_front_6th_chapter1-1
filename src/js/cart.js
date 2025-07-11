// 상품, 상품 개수,

import Header from "../components/Header";
import Toast from "../components/Toast";
import { render, store } from "../main";

export function handleGetCartItem() {
  const cart = window.localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function handleAddCart(value) {
  const current = handleGetCartItem();
  Toast.mount("addCart");

  const hasAlreadyProduct = current.findIndex((product) => product.productId === value.productId);

  if (hasAlreadyProduct === -1) {
    // 장바구니에 없는 아이템
    const newCart = [...current, value];
    window.localStorage.setItem("cart", JSON.stringify(newCart));
    store.set("cart", newCart.length);
  } else {
    // 장바구니에 있는 아이템
    // 수량 비교
    const existingProduct = current[hasAlreadyProduct];

    if (existingProduct.quantity !== value.quantity) {
      // 수량이 다르면 새로운 수량으로 업데이트
      current[hasAlreadyProduct] = value;
    } else {
      // 수량이 같으면 기존 수량에 더하기
      current[hasAlreadyProduct].quantity = parseInt(existingProduct.quantity) + parseInt(value.quantity);
    }

    window.localStorage.setItem("cart", JSON.stringify(current));
  }

  render.draw("header", Header());
  Header.mount();
}
