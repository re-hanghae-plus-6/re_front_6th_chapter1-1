import { getProducts } from "../api/productApi.js";
import { state, setProductList, setTotal, setLoading, resetState } from "../store.js";

export async function getProductList(reset = true) {
  if (reset) {
    setLoading(true);
    resetState();
  }

  if (window.app && window.app.render) {
    window.app.render();
  }

  const productData = await getProducts({
    limit: state.limit,
    page: state.currentPage,
  });

  if (reset) {
    setProductList(productData.products);
    setLoading(false);
  } else {
    setProductList([...state.productList, ...productData.products]);
  }

  setTotal(productData.pagination.total);

  if (window.app && window.app.render) {
    window.app.render();
  }
}
