import { getProducts } from "../api/productApi";

// 검색 실행 함수
export const performSearch = async (state, searchTerm, renderCallback) => {
  try {
    // 검색 상태로 변경
    state.page = 1;
    state.search = searchTerm;
    state.hasMore = true;
    state.products = [];

    // 검색 결과 가져오기
    const { products, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: searchTerm,
      category1: state.category1,
      category2: state.category2,
    });

    state.products = products;
    state.hasMore = products.length === state.limit;
    state.totalProducts = pagination.total;

    // 화면 다시 렌더링
    renderCallback();
  } catch (error) {
    console.error("검색 실패:", error);
  }
};

// 검색어 초기화 함수
export const clearSearch = async (state, renderCallback) => {
  state.search = "";
  state.page = 1;
  state.hasMore = true;
  state.products = [];

  try {
    const { products, pagination } = await getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      category1: state.category1,
      category2: state.category2,
    });

    state.products = products;
    state.hasMore = products.length === state.limit;
    state.totalProducts = pagination.total;
    renderCallback();
  } catch (error) {
    console.error("검색 초기화 실패:", error);
  }
};

// 검색 이벤트 리스너 설정 함수
export const setupSearchEventListeners = (state, renderCallback) => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-search-button");

  if (!searchInput) return;

  // 검색 버튼 클릭 이벤트
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        performSearch(state, searchTerm, renderCallback);
      }
    });
  }

  // Enter 키 이벤트
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        performSearch(state, searchTerm, renderCallback);
      }
    }
  });

  // 검색어 초기화 버튼
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      clearSearch(state, renderCallback);
    });
  }
};
