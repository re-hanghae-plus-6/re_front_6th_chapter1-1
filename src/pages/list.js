import ProductList from "../components/product-list.js";
import Filter from "../components/filter.js";
import { getProducts } from "../api/productApi.js";
import { ListStore } from "../store.js";
import { ListHeader } from "../components/header.js";
import Footer from "../components/footer.js";

function ListPage({ isLoading = true, fetchData, limit, sort } = {}) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${ListHeader()}
      <main class="max-w-md mx-auto px-4 py-4">
        ${Filter({ limit, sort })}
        <div class="mb-6" id="product-list">${ProductList({ isLoading, fetchData })}</div>
      </main>
      ${Footer()}
    </div>
  `;
}

// mount 함수 수정
ListPage.mount = function () {
  const store = new ListStore();
  const storeState = store.getState();
  const root = document.getElementById("root");

  function fetchAndRender() {
    getProducts(storeState).then((data) => {
      // list 페이지 마운트 후 받아온 데이터로 list 렌더링
      root.innerHTML = ListPage({
        isLoading: false,
        fetchData: data,
        limit: data.pagination.limit,
        sort: data.filters.sort,
      });
      // 이벤트 등록 함수 호출 제거
    });
  }

  fetchAndRender();

  // 이벤트 리스너들
  function handleChangeLimit(e) {
    store.setLimit(e.detail.limit);
    fetchAndRender();
  }

  function handleChangeSort(e) {
    store.setSort(e.detail.sort);
    fetchAndRender();
  }

  function handleChangeSearch(e) {
    store.setSearch(e.detail.search);
    fetchAndRender();
  }

  // 이벤트 리스너 등록
  window.addEventListener("changeLimit", handleChangeLimit);
  window.addEventListener("changeSort", handleChangeSort);
  window.addEventListener("changeSearch", handleChangeSearch);

  // cleanup 함수 반환
  return function cleanup() {
    // 이벤트 리스너 제거
    window.removeEventListener("changeLimit", handleChangeLimit);
    window.removeEventListener("changeSort", handleChangeSort);
    window.removeEventListener("changeSearch", handleChangeSearch);

    // 진행 중인 API 요청이 있다면 취소 (AbortController 사용)
    // store 정리 등 추가 정리 작업
    console.log("ListPage cleanup 완료");
  };
};

export default ListPage;
