import Category from "../components/product/list/Category";
import Layout from "../components/product/list/Layout";
import ProductList from "../components/product/list/ProductList";

function Products() {
  const loading = true;

  return Layout({
    children: `${Category({ loading })}
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">340개</span>의 상품
        </div>
        ${ProductList({
          products: [
            {
              id: 1,
              name: "상품1",
              price: 10000,
            },
            {
              id: 2,
              name: "상품2",
              price: 20000,
            },
          ],
          loading,
        })}
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      </div>
    </div>`,
    loading,
  });
}

export default Products;
