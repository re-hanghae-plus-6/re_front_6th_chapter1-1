import { fetchProductDetail } from "../../entities/productDetail";
import { productDetailStore } from "../../store";
import { ProductDetailLoading } from "./productDetailLoading";

export const ProductDetailBody = async () => {
  const id = window.location.pathname.split("/product/")[1];
  if (id && productDetailStore.state.productId !== id && !productDetailStore.state.isLoading) {
    console.log("fetchProductDetail", id, productDetailStore.state.productId);
    await fetchProductDetail(id);
  }

  const { isLoading } = productDetailStore.state;
  console.log("isLoading", isLoading);
  if (isLoading) {
    return ProductDetailLoading();
  }

  return;
};
