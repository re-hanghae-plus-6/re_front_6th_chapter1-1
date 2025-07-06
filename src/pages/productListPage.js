import { getProducts } from "../api/productApi";
import { productListLoaded } from "../components/productListLoaded";
import { productListLoading } from "../components/productListLoading";

export const productListPage = async () => {
  document.getElementById("root").innerHTML = productListLoading;

  try {
    const data = await getProducts();
    const { products } = data;
    document.getElementById("root").innerHTML = productListLoaded(products);
  } catch (error) {
    console.error("상품 목록 로딩 실패:", error);
    // 404 페이지 추가
  }
};
