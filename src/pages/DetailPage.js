import ProductDetailLoaded from "../components/ProductDetailLoaded.js";
import ProductDetailLoading from "../components/ProductDetailLoading.js";

export const LoadingUI = () => {
  return /* HTML */ `
    <div class="py-20 bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
    </div>
  `;
};

const DetailPage = async (params = {}, state) => {
  const { id } = params;

  if (!id) {
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800 mb-4">상품 ID가 없습니다</h1>
          <p class="text-gray-600 mb-4">올바른 상품 페이지로 이동해주세요.</p>
          <button onclick="window.history.back()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    `;
  }

  try {
    return state.isLoading ? ProductDetailLoading() : ProductDetailLoaded({ productId: id }, state);
  } catch (error) {
    console.error("상품 상세 페이지 로딩 중 오류:", error);
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800 mb-4">페이지 로딩 오류</h1>
          <p class="text-gray-600 mb-4">상품 정보를 불러오는 중 오류가 발생했습니다.</p>
          <button onclick="window.history.back()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    `;
  }
};

export default DetailPage;
