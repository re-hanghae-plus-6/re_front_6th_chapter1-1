import { getProducts } from "../api/productApi";
import ErrorContent from "../components/error/ErrorContent";
import ProductItem from "../components/product/ProductItem";
import { ProductListLoading } from "../components/product/ProductLoading";

/**
 * @param {Object} query - { page, limit, search, category1, category2, sort }
 */
export async function loadProductList(query) {
  const productsContainer = document.getElementById("products-grid");
  if (!productsContainer) return;

  // 초기 로딩 UI 표시
  productsContainer.innerHTML = ProductListLoading();

  try {
    const { products, pagination } = await getProducts(query);

    const productListHTML = products.map((product) => ProductItem(product)).join("");

    productsContainer.innerHTML = /* HTML */ `
      <div>
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${pagination.total}개</span>의 상품
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">${productListHTML}</div>
      </div>
    `;
  } catch (error) {
    console.error("상품 불러오기 실패:", error);

    // 에러 UI 표시
    productsContainer.innerHTML = /* HTML */ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        ${ErrorContent("상품 정보를 불러올 수 없어요. 😥", "product-retry-button")}
      </div>
    `;

    // 재시도 이벤트 연결
    const retryButton = document.getElementById("product-retry-button");
    retryButton?.addEventListener("click", () => {
      loadProductList(query); // 다시 시도
    });
  }
}
