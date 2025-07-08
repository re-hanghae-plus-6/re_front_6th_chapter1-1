import Header from "../components/header.js";
import ProductCard from "../components/product-card.js";
import Footer from "../components/footer.js";
import Filter from "../components/filter.js";
import { getProducts } from "../api/productApi.js";

function ListPage({ isLoading = true, fetchData } = {}) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        ${Filter()}
        <div class="mb-6" id="product-list">${ProductCard({ isLoading, fetchData })}</div>
      </main>
      ${Footer()}
    </div>
  `;
}

// mount 함수 추가
ListPage.mount = function () {
  const root = document.getElementById("root");
  getProducts({
    page: 1,
    limit: 20,
    search: "",
    category1: "",
    category2: "",
  }).then((data) => {
    root.innerHTML = ListPage({ isLoading: false, fetchData: data });
  });
};

export default ListPage;
