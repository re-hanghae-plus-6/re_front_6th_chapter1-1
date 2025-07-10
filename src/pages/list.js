import Header from "../components/header.js";
import ProductCard from "../components/product-card.js";
import Footer from "../components/footer.js";
import Filter, { changeLimitEvent, changeSortEvent, changeSearchEvent } from "../components/filter.js";
import { getProducts } from "../api/productApi.js";
import { Store } from "../store.js";

function ListPage({ isLoading = true, fetchData, limit, sort } = {}) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        ${Filter({ limit, sort })}
        <div class="mb-6" id="product-list">${ProductCard({ isLoading, fetchData })}</div>
      </main>
      ${Footer()}
    </div>
  `;
}

// mount 함수 추가
ListPage.mount = function () {
  const store = new Store();
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
      changeLimitEvent();
      changeSortEvent();
      changeSearchEvent();
    });
  }

  fetchAndRender();

  window.addEventListener("changeLimit", (e) => {
    store.setLimit(e.detail.limit);
    fetchAndRender();
  });

  window.addEventListener("changeSort", (e) => {
    store.setSort(e.detail.sort);
    fetchAndRender();
  });

  window.addEventListener("changeSearch", (e) => {
    console.log("changeSearch", e.detail.search);
    store.setSearch(e.detail.search);
    fetchAndRender();
  });
};

export default ListPage;
