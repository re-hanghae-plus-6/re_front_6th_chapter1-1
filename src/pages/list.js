import ProductList from "../components/product-list.js";
import Filter from "../components/filter.js";
import { getProducts } from "../api/productApi.js";
import { ListStore } from "../store.js";
import { ListHeader } from "../components/header.js";
import Footer from "../components/footer.js";

function ListPage({ isLoading = true, fetchData, limit, sort, search } = {}) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${ListHeader()}
      <main class="max-w-md mx-auto px-4 py-4">
        ${Filter({ limit, sort, search })}
        <div class="mb-6" id="product-list">${ProductList({ isLoading, fetchData })}</div>
      </main>
      ${Footer()}
    </div>
  `;
}

// mount 함수 수정
ListPage.mount = function () {
  const store = new ListStore();
  const root = document.getElementById("root");

  function fetchAndRender() {
    const storeState = store.getState();
    getProducts(storeState).then((data) => {
      // list 페이지 마운트 후 받아온 데이터로 list 렌더링
      root.innerHTML = ListPage({
        isLoading: false,
        fetchData: data,
        limit: storeState.limit,
        sort: storeState.sort,
        search: storeState.search,
      });
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

  // 브라우저 뒤로가기/앞으로가기 이벤트 처리
  function handlePopstate() {
    // URL이 변경되었으므로 store를 새로 초기화하여 URL 쿼리 반영
    const newStore = new ListStore();
    Object.assign(store, newStore);
    fetchAndRender();
  }

  // 이벤트 리스너 등록
  window.addEventListener("changeLimit", handleChangeLimit);
  window.addEventListener("changeSort", handleChangeSort);
  window.addEventListener("changeSearch", handleChangeSearch);
  window.addEventListener("popstate", handlePopstate);

  // cleanup 함수 반환
  return function cleanup() {
    // 이벤트 리스너 제거
    window.removeEventListener("changeLimit", handleChangeLimit);
    window.removeEventListener("changeSort", handleChangeSort);
    window.removeEventListener("changeSearch", handleChangeSearch);
    window.removeEventListener("popstate", handlePopstate);
  };
};

export default ListPage;
