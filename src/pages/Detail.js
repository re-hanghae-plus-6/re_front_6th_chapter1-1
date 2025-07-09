import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductDetail from "../components/detail/ProductDetail.js";
import RelatedProduct from "../components/detail/RelatedProduct.js";
import Breadcrumb from "../components/detail/Breadcrumb.js";
import { getProduct, getProducts } from "../api/productApi.js";
import { router } from "../router.js";

export default function Detail(params = {}) {
  const { productId } = params;

  const template = `
    <div class="min-h-screen bg-gray-50">
      ${Header("detail")}
      <main class="max-w-md mx-auto px-4 py-4">
        <div id="breadcrumb-container">
          ${Breadcrumb()}
        </div>
        
        <!-- 상품 상세 정보 -->
        ${ProductDetail()}
        
        <!-- 관련 상품 -->
        <div id="related-product-container">
          ${RelatedProduct()}
        </div>
      </main>
      ${Footer()}
    </div>
  `;

  async function mount() {
    const backButton = document.getElementById("back-button");
    const goToListButton = document.querySelector(".go-to-product-list");

    async function loadProduct() {
      try {
        const product = await getProduct(productId);

        if (product) {
          document.getElementById("product-image").src = product.image;
          document.getElementById("product-image").alt = product.title;
          document.getElementById("product-title").textContent = product.title;
          document.getElementById("product-mall").textContent = product.mallName || "";
          document.getElementById("product-price").textContent = `${Number(product.lprice).toLocaleString()}원`;
          document.getElementById("product-stock").textContent = product.stock || "107";
          document.getElementById("product-description").textContent =
            product.description || `${product.title}에 대한 상세 설명입니다.`;

          // 브레드크럼
          const breadcrumbContainer = document.getElementById("breadcrumb-container");
          if (breadcrumbContainer) {
            breadcrumbContainer.innerHTML = Breadcrumb(product.category1, product.category2);
          }
        } else {
          throw new Error("상품을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("상품 상세 로드 에러:", error);
      }
    }

    await loadProduct();

    // 뒤로가기 버튼 이벤트
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    // 상품 목록으로 돌아가기 버튼 이벤트
    goToListButton.addEventListener("click", () => {
      window.history.back();
    });

    // 장바구니 버튼 이벤트
    document.addEventListener("click", (e) => {
      if (e.target.id === "add-to-cart-btn") {
        console.log("장바구니 담기:", productId);
      }
    });
  }

  return { template, mount };
}
