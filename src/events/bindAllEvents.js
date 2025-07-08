import { fetchProducts } from "../entities/products";
import { productsStore } from "../store";

export const bindAllEvents = () => {
  // 상품 개수 Limit 선택 이벤트
  const limitSelectElement = document.getElementById("limit-select");
  if (limitSelectElement) {
    limitSelectElement.value = productsStore.state.pagination.limit + "";
    limitSelectElement.onchange = (e) => {
      const limit = Number(e.target.value);
      fetchProducts({
        ...productsStore.state.pagination,
        limit,
        page: 1, // 보통 첫 페이지로 초기화
      });
    };
  }
};
