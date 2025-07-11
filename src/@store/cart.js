const cart = {
  state: [],
  init: () => {
    const __state = localStorage.getItem("cart");

    cart.state = __state ? JSON.parse(__state) : [];

    console.log(cart.state);

    if (!__state) {
      localStorage.setItem("cart", JSON.stringify(cart.state));
    }
  },
  setState: (changeState) => {
    cart.state = [...changeState];

    localStorage.setItem("cart", JSON.stringify(cart.state));
  },
};

export default cart;
