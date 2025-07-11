import { fetchProductDetail } from "../../entities/productDetail";
import { productDetailStore } from "../../store";
import { Breadcrumb } from "../common/Breadcrumb";
import { ProductDetailLoading } from "./productDetailLoading";
import { ProductInformation } from "./ProductInformation";
import { RelatedProducts } from "./RelatedProducts";
import { ReturnToListBtn } from "./ReturnToListBtn";

export const ProductDetailBody = async () => {
  const id = window.location.pathname.split("/product/")[1];
  if (id && productDetailStore.state.productDetail.productId !== id && !productDetailStore.state.isLoading) {
    await fetchProductDetail(id);
  }

  const { isLoading, productDetail } = productDetailStore.state;
  console.log("productDetail", productDetail);
  if (isLoading) {
    return ProductDetailLoading();
  }

  return Breadcrumb(productDetail) + ProductInformation(productDetail) + ReturnToListBtn() + RelatedProducts();
};
