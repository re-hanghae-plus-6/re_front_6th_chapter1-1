import { productDetailStore } from "../model/product-detail-store";
import { getProduct } from "../../../api/productApi";

export async function handleProductDetail() {
  // 상품 ID를 URL에서 추출
  const match = window.location.pathname.match(/product\/(\d+)/);
  const productId = match ? match[1] : null;

  if (!productId) return;

  productDetailStore.setValue((prev) => ({
    ...prev,
    isLoading: true,
    error: null,
  }));

  try {
    const product = await getProduct(productId);

    productDetailStore.setValue((prev) => ({
      ...prev,
      isLoading: false,
      data: product,
    }));
  } catch (error) {
    productDetailStore.setValue((prev) => ({
      ...prev,
      isLoading: false,
      error,
    }));
  }
}
