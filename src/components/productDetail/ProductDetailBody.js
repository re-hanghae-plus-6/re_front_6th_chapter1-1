import { productDetailStore } from "../../store";

export const ProductDetailBody = async () => {
  const id = window.location.pathname.split("/product/")[1];
  console.log(id);
  //   await fetchProductDetail(id);
  console.log("productDetail", productDetailStore.state);
};
