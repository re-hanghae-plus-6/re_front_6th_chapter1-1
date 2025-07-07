import ProductList from '../product-list/ProductList.js';
import ProductItem from '../product-item/ProductItem.js';

async function ProductContainer() {
  return `
    <!-- 상품 개수 정보 -->
    <div class="mb-4 text-sm text-gray-600">
      총 <span class="font-medium text-gray-900">340개</span>의 상품
    </div>
    ${ProductList({
      children: ProductItem(),
    })}
  `;
}

export default ProductContainer;
