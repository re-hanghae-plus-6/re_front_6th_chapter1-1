import { getProducts } from "../api/productApi";
import { productListLoaded } from "../components/productListLoaded";
import { productListLoading } from "../components/productListLoading";

let state = {
  limit: 20,
};

// 로딩 화면 렌더링
const renderLoading = () => {
  document.getElementById("root").innerHTML = productListLoading;
};

// 데이터 기반 렌더링
const renderContent = async () => {
  renderLoading();

  const render = async () => {
    document.getElementById("root").innerHTML = productListLoading;

    try {
      const { products } = await getProducts({ limit: state.limit });
      document.getElementById("root").innerHTML = productListLoaded(products, state.limit);
      // 옵션 갯수 드롭다운 제어
      setupProductLimitControl();
    } catch (error) {
      console.error("상품 목록 로딩 실패:", error);
      document.getElementById("root").innerHTML = `<div class="p-4 text-red-600">상품을 불러오지 못했습니다.</div>`;
    }
  };

  await render();
};

// 옵션 갯수 드롭다운
const setupProductLimitControl = () => {
  const select = document.getElementById("limit-select");
  if (!select) return;

  select.value = String(state.limit);

  select.addEventListener("change", async (e) => {
    const newLimit = parseInt(e.target.value, 10);

    if (!isNaN(newLimit) && newLimit !== state.limit) {
      state.limit = newLimit;
      await renderContent();
    }
  });
};

export const productListPage = async () => {
  await renderContent();
};
