import { fetchProducts } from "../entities/products";
import { productsStore } from "../store";
import { navigate } from "./navigate";

export const bindAllEvents = () => {
  // 상품 리스트 개수 Limit 선택 이벤트
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

  // 상품 리스트 정렬 선택 이벤트
  const sortSelectElement = document.getElementById("sort-select");
  if (sortSelectElement) {
    sortSelectElement.value = productsStore.state.filters.sort + "";
    sortSelectElement.onchange = (e) => {
      const sort = e.target.value;
      fetchProducts({ sort });
    };
  }

  // 상품 리스트 검색 이벤트
  const searchInputElement = document.getElementById("search-input");
  if (searchInputElement) {
    searchInputElement.onkeydown = (e) => {
      if (e.key === "Enter") {
        const search = e.target.value;
        fetchProducts({ search, page: 1 }); // 보통 검색 시 첫 페이지로 초기화
      }
    };
  }

  // 상품 리스트에서 상품 클릭시 상세페이지로 이동 이벤트
  const productItemElements = document.querySelectorAll(".product-card");
  if (productItemElements) {
    productItemElements.forEach((element) => {
      element.addEventListener("click", () => {
        const productId = element.dataset.productId;
        navigate(`/product/${productId}`);
      });
    });
  }
};
