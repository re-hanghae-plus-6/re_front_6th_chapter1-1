import { getProduct } from "../api/productApi";
import { productDetailStore } from "../store";

export const fetchProductDetail = async (id) => {
  productDetailStore.setState({ isLoading: true, error: null });

  try {
    const product = await getProduct(id);

    productDetailStore.setState({ productDetail: { ...product }, isLoading: false });
    return product;
  } catch (error) {
    console.error(error);
    productDetailStore.setState({ error: "상품 상세 조회 에러", isLoading: false });
    return null;
  }
};
