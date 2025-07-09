import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getProducts } from "../api/productApi.js";
import { productStore } from "../store/productStore.js";
import ProductFilter from "../components/product/ProductFilter.js";

function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  const totalCountContainer = document.getElementById("total-count-container");

  const state = productStore.getState();

  if (!productsGrid) return;

  if (state.loading) {
    productsGrid.innerHTML = Array(6).fill().map(ProductSkeleton).join("");
    if (totalCountContainer) {
      totalCountContainer.style.display = "none";
      totalCountContainer.textContent = "";
    }
    return;
  }

  productsGrid.innerHTML = state.products.map(ProductCard).join("");
  if (totalCountContainer) {
    totalCountContainer.style.display = "block";
    totalCountContainer.innerHTML = `총 <span id="total-count" class="font-medium text-gray-900">${state.totalCount}개</span>의 상품`;
  }
}

async function loadProducts() {
  productStore.setLoading(true);
  productStore.setError(null);
  try {
    const state = productStore.getState();
    const response = await getProducts({
      limit: state.limit,
      sort: state.sort,
      search: state.search,
    });
    if (response.products) {
      productStore.setProducts(response.products);
      productStore.setTotalCount(response.pagination?.total ?? response.products.length);
    } else {
      productStore.setError("상품 목록을 불러오는데 실패했습니다.");
    }
  } catch (error) {
    productStore.setError("상품 목록을 불러오는데 실패했습니다.");
    console.error("상품 목록 로드 에러:", error);
  } finally {
    productStore.setLoading(false);
  }
}

export default function Home() {
  const state = productStore.getState();

  const template = `
    ${Header()}
    <main class="max-w-md mx-auto px-4 py-4">
     ${ProductFilter({ state })}
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          <div id="total-count-container" class="mb-4 text-sm text-gray-600">

          </div>
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
          <div class="text-center py-4 text-sm text-gray-500">
            모든 상품을 확인했습니다
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  function mount() {
    renderProducts();
    loadProducts();

    const limitSelect = document.getElementById("limit-select");
    if (limitSelect) {
      limitSelect.addEventListener("change", (e) => {
        const newLimit = parseInt(e.target.value);
        productStore.setLimit(newLimit);
        loadProducts();
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        const newSort = e.target.value;
        productStore.setSort(newSort);
        loadProducts();
      });
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const searchTerm = e.target.value.trim();
          productStore.setSearch(searchTerm);
          loadProducts();
        }
      });
    }

    const unsubscribe = productStore.subscribe(renderProducts);
    return () => unsubscribe();
  }

  return { template, mount };
}
