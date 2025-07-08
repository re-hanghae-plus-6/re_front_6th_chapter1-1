import { getProduct } from "../api/productApi";
import DetailLayout from "../components/product/detail/DetailLayout";
import ProductDetailContent from "../components/product/detail/ProductDetailContent";
import { router } from "../routes";

function Product() {
  const { productId } = router.getParams({ path: "/product/:productId" });

  const updateProductUI = ({ product }) => {
    const productDetailContentElement = document.getElementById("product-detail-content");
    productDetailContentElement.innerHTML = ProductDetailContent({ product, loading: false });
  };

  const loadProduct = async (productId) => {
    try {
      const response = await getProduct(productId);

      updateProductUI({
        product: response,
      });
    } catch (error) {
      console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  loadProduct(productId);

  return DetailLayout({ children: ProductDetailContent({ loading: true }), loading: true });
}

export default Product;
