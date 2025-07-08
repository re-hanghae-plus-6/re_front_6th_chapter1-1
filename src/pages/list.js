import Header from "../components/header.js";
import ProductCard from "../components/product-card.js";
import Footer from "../components/footer.js";
import Filter, { changeLimitEvent } from "../components/filter.js";
import { getProducts } from "../api/productApi.js";
import { Store } from "../store.js";

function ListPage({ isLoading = true, fetchData, limit } = {}) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        ${Filter({ limit })}
        <div class="mb-6" id="product-list">${ProductCard({ isLoading, fetchData })}</div>
      </main>
      ${Footer()}
    </div>
  `;
}

// mount 함수 추가
ListPage.mount = function () {
  const store = new Store();
  const { limit } = store.getState();
  const root = document.getElementById("root");

  function fetchAndRender(limit) {
    // list 페이지 마운트 전
    root.innerHTML = ListPage({ isLoading: true, limit });

    getProducts(store.getState()).then((data) => {
      // list 페이지 마운트 후
      root.innerHTML = ListPage({ isLoading: false, fetchData: data, limit: data.pagination.limit });
      changeLimitEvent();
    });
  }

  fetchAndRender(limit);

  window.addEventListener("changeLimit", (e) => {
    store.setLimit(e.detail.limit);
    fetchAndRender(store.getState().limit);
  });
};

export default ListPage;
