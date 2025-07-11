import DetailLoading from "./loadingUi";
import DetailItem from "./DetailItem";
import RelatedItem from "./RelatedItem";

const Detail = ({ product, relatedProducts, loading }) => {
  if (loading) {
    return DetailLoading;
  }

  return `
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 브레드크럼 -->
      <nav class="mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link hover:text-blue-600 transition-colors" data-category1="${product?.category1 || ""}">
            ${product?.category1 || "카테고리"}
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link hover:text-blue-600 transition-colors" data-category2="${product?.category2 || ""}">
            ${product?.category2 || "상품"}
          </button>
        </div>
      </nav>
      
      <!-- 상품 상세 정보 -->
      ${product ? DetailItem(product) : ""}
      
      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
          hover:bg-gray-200 transition-colors go-to-product-list">
          상품 목록으로 돌아가기
        </button>
      </div>
      
      <!-- 관련 상품 -->
      ${RelatedItem(relatedProducts)}
    </main>
  `;
};

export default Detail;
