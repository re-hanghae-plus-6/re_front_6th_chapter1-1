import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getProducts } from "../api/productApi.js";
import { productStore } from "../store/productStore.js";

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
    const response = await getProducts({ limit: state.limit });
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
  const limitOptions = [10, 20, 50, 100];

  const template = `
    ${Header()}
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">카테고리:</label>
              <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
            </div>
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
            </div>
            <!-- 2depth 카테고리 -->
          </div>
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">개수:</label>
              <select id="limit-select"
                      class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                ${limitOptions
                  .map(
                    (limit) =>
                      `<option value="${limit}" ${state.limit === limit ? "selected" : ""}>${limit}개</option>`,
                  )
                  .join("")}
              </select>
            </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">정렬:</label>
              <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="price_asc" selected="">가격 낮은순</option>
                <option value="price_desc">가격 높은순</option>
                <option value="name_asc">이름순</option>
                <option value="name_desc">이름 역순</option>
              </select>
            </div>
          </div>
        </div>
      </div>
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

    const unsubscribe = productStore.subscribe(renderProducts);
    return () => unsubscribe();
  }

  return { template, mount };
}
