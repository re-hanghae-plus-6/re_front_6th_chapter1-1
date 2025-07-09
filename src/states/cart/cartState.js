// [
//   {
//     productId: 12345,
//     title: "상품 A",
//     image: "/img/a.jpg",
//     lprice: 12000,
//     quantity: 2
//     stock: 12
//   }
// ]

const CART_KEY = "cartItems";

const getCardStorage = () => {
  try {
    const cartStorage = localStorage.getItem(CART_KEY);
    return cartStorage ? JSON.parse(cartStorage) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

let cartItems = getCardStorage();
let listeners = [];

function notify() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  listeners.forEach((callback) => callback(cartItems));
}

export const cartState = {
  getState: () => cartItems,

  setState: (newItems) => {
    cartItems = [...newItems];
    notify();
  },

  subscribe: (callback) => {
    listeners.push(callback);
    callback(cartItems);

    return () => {
      listeners = listeners.filter((listener) => listener !== callback);
    };
  },
};
