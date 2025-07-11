import { getProduct } from "../api/productApi.js";
// import { DetailStore } from "../store.js";
import { DetailHeader } from "../components/header.js";
import Footer from "../components/footer.js";
import ProductDetail from "../components/product-detail.js";

function DetailPage({ isLoading = true, fetchData } = {}) {
  console.log(fetchData);
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${DetailHeader()}
      <main class="max-w-md mx-auto px-4 py-4">${ProductDetail({ isLoading, fetchData })}</main>
      ${Footer()}
    </div>
  `;
}

// mount 함수 추가
DetailPage.mount = function () {
  const productId = window.location.pathname.split("/")[2];
  // const store = new DetailStore();
  // const storeState = store.getState();

  const root = document.getElementById("root");
  function fetchDetailAndRender() {
    getProduct(productId).then((data) => {
      // list 페이지 마운트 후 받아온 데이터로 list 렌더링
      root.innerHTML = DetailPage({
        isLoading: false,
        fetchData: data,
      });
    });
  }

  fetchDetailAndRender();

  // cleanup 함수 반환
  return function cleanup() {
    // 상세 페이지 관련 정리 작업
    console.log("DetailPage cleanup 완료");
  };
};

export default DetailPage;
