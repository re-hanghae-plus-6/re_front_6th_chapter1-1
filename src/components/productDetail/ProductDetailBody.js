import { fetchProductDetail } from "../../entities/productDetail";
import { fetchRelatedProducts } from "../../entities/relatedProducts";
import { productDetailStore, relatedProductsStore } from "../../store";
import { Breadcrumb } from "../common/Breadcrumb";
import { ProductDetailLoading } from "./productDetailLoading";
import { ProductInformation } from "./ProductInformation";
import { RelatedProducts } from "./RelatedProducts";
import { ReturnToListBtn } from "./ReturnToListBtn";

export const ProductDetailBody = async () => {
  const id = window.location.pathname.split("/product/")[1];
  if (id && productDetailStore.state.productDetail.productId !== id && !productDetailStore.state.isLoading) {
    fetchProductDetail(id);
  }

  if (
    productDetailStore.state.productDetail.category2 &&
    !relatedProductsStore.state.isLoading &&
    (!relatedProductsStore.state.products || relatedProductsStore.state.products.length === 0)
  ) {
    fetchRelatedProducts({ category2: productDetailStore.state.productDetail.category2 });
  }

  const { isLoading, productDetail } = productDetailStore.state;
  const { products } = relatedProductsStore.state;
  if (isLoading) {
    return ProductDetailLoading();
  }

  return (
    Breadcrumb(productDetail) +
    ProductInformation(productDetail) +
    ReturnToListBtn() +
    (products.length > 0 ? RelatedProducts(products.filter((product) => product.productId !== id)) : "")
  );
};
