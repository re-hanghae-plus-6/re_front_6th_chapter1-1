import ListPage from "./ListPage.js";
import ProductPage from "./ProductPage.js";
import CartPage from "./CartPage.js";

export default (main) => {
  const home = () => new ListPage(main);
  const product = () => new ProductPage(main);
  const cart = () => new CartPage(main);

  return {
    home,
    product,
    cart,
  };
};
