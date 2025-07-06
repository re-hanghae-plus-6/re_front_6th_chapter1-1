import { DefaultHeader } from "../components/common/Header.js";
import { Footer } from "../components/common/Footer.js";
import { ProductSkeletonCard } from "../components/product/ProductSkeletonCard.js";
import { ProductCard } from "../components/product/ProductCard.js";
import { ProductFilterPanel } from "../components/product/ProductFilterPanel.js";
import { LoadingIndicator } from "../components/common/LoadingIndicator.js";
import { productState } from "../core/productState.js";
import { normalizeCategories } from "../utils/normalizeCategories.js";

export const HomePage = () => {
  // 최초 mount
  setTimeout(initDataLoad, 0);

  function initDataLoad() {
    loadCategories().then(loadProducts);
  }

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const raw = await res.json();
    productState.categories = normalizeCategories(raw);
    productState.loadingCategories = false;
    renderFilter();
  }

  async function loadProducts() {
    const qs = new URLSearchParams({
      page: 1,
      limit: productState.filters.limit,
      search: productState.filters.search,
      category1: productState.filters.category1,
      category2: productState.filters.category2,
      sort: productState.filters.sort,
    });
    const res = await fetch(`/api/products?${qs.toString()}`);
    console.log("API 호출:", `/api/products?${qs.toString()}`);
    const data = await res.json();

    console.log(data);

    productState.products = data.products;
    productState.total = data.pagination.total;
    renderProducts();
  }

  function renderFilter() {
    document.getElementById("filter-panel").innerHTML = ProductFilterPanel();
    bindFilterEvents();
  }

  function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = productState.products.map(ProductCard).join("");

    const infoEl = document.getElementById("total-info");
    infoEl.innerHTML = `총 <span class="font-medium text-gray-900">${productState.total}개</span>의 상품`;
    infoEl.style.display = "block";
  }

  /* ---------------- 이벤트 바인딩 ---------------- */
  function bindFilterEvents() {
    // 1Depth
    document.querySelectorAll(".category1-filter-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        productState.filters.category1 = e.target.dataset.category1;
        productState.filters.category2 = "";
        renderFilter();
        loadProducts();
      }),
    );

    // 2Depth
    document.querySelectorAll(".category2-filter-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        productState.filters.category1 = e.target.dataset.category1;
        productState.filters.category2 = e.target.dataset.category2;
        renderFilter();
        loadProducts();
      }),
    );

    // limit & sort
    document.getElementById("limit-select").onchange = (e) => {
      productState.filters.limit = +e.target.value;
      loadProducts();
    };
    document.getElementById("sort-select").onchange = (e) => {
      productState.filters.sort = e.target.value;
      loadProducts();
    };

    // 검색
    document.getElementById("search-input").oninput = (e) => {
      productState.filters.search = e.target.value.trim();
      loadProducts();
    };
  }

  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${DefaultHeader()}
      <main class="max-w-md mx-auto px-4 py-4">
        <div id="filter-panel">
          ${ProductFilterPanel()}  <!-- 초기엔 loading중 상태 -->
        </div>

        <!-- 상품 영역 -->
        <div class="mb-6">
          <!-- 총 상품 수 (숨김) -->
          <div class="mb-4 text-sm text-gray-600" id="total-info" style="display:none"></div>

          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            ${Array(4)
              .fill(null)
              .map(() => ProductSkeletonCard())
              .join("")}
          </div>

          ${LoadingIndicator("상품을 불러오는 중...")}
        </div>
      </main>
      ${Footer()}
    </div>
  `;
};
