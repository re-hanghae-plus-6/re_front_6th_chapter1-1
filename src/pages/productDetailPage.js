import { DetailLoadingIndicator } from "../components/detail/loading/detailLoadingIndicator.js";
import { ProductDetail } from "../components/detail/product/productDetail.js";
import { DetailBreadCrumb } from "../components/detail/layout/detailBreadCrumb.js";
import { Header } from "../components/productList/layout/header.js";
import { RelatedProducts } from "../components/detail/product/relatedProducts.js";
import { Footer } from "../components/productList/layout/footer.js";

const state = {
  product: null,
  isLoading: false,
};

export const ProductDetailPage = () => {
  return `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title: "쇼핑몰", cartItemCount: 0 })}
    <main class="max-w-md mx-auto px-4 py-4">
      ${
        state.isLoading
          ? DetailLoadingIndicator
          : `
          <!-- 브레드크럼 -->
          ${DetailBreadCrumb({
            category1: "생활/건강",
            category2: "생활용품",
          })}
            <!-- 상품 상세 정보 -->
            ${ProductDetail({
              image: "https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg",
              name: "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장",
              rating: 4.0,
              reviewCount: 749,
              price: 220,
              stock: 107,
              description:
                "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장 브랜드의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.",
            })}`
      }
      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
          hover:bg-gray-200 transition-colors go-to-product-list">
          상품 목록으로 돌아가기
        </button>
      </div>
      <!-- 관련 상품 -->
      ${RelatedProducts({
        products: [
          {
            image: "https://shopping-phinf.pstatic.net/main_8694085/86940857379.1.jpg",
            name: "샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이",
            price: 230,
            id: "86940857379",
          },
          {
            image: "https://shopping-phinf.pstatic.net/main_8209446/82094468339.4.jpg",
            name: "실리카겔 50g 습기제거제 제품 /산업 신발 의류 방습제",
            price: 280,
            id: "82094468339",
          },
        ],
      })}
    </main>
    ${Footer}
  </div>
  `;
};
