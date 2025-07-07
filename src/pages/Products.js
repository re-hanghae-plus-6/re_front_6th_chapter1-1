import { getProducts } from "../api/productApi";
import Category from "../components/product/list/Category";
import Layout from "../components/product/list/Layout";
import ProductList from "../components/product/list/ProductList";

function Products() {
  const updateProductsUI = ({ products }) => {
    const productListElement = document.getElementById("products-grid");

    productListElement.replaceWith(ProductList({ products, loading: false }));
  };

  const updateTotalProductsCountUI = ({ count }) => {
    const totalProductsCountContainer = document.getElementById("total-products-count");
    totalProductsCountContainer.innerHTML = `총 <span class="font-medium text-gray-900">${count}개</span>의 상품`;
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();

      updateProductsUI({
        products: response.products,
      });
      updateTotalProductsCountUI({ count: response.pagination.total });
    } catch (error) {
      console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  loadProducts();

  return Layout({
    children: `${Category({ loading: true })}
    <div class="mb-6">
      <div id="products-container">
        <div id="total-products-count" class="mb-4 text-sm text-gray-600"></div>
        ${ProductList({ loading: true })}
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      </div>
    </div>`,
  });
}

export default Products;
