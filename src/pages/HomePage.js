import { DefaultHeader } from "../components/common/Header.js";
import { Footer } from "../components/common/Footer.js";
import { ProductSkeletonCard } from "../components/product/ProductSkeletonCard.js";
import { ProductCard } from "../components/product/ProductCard.js";
import { ProductFilterPanel } from "../components/product/ProductFilterPanel.js";
import { LoadingIndicator } from "../components/common/LoadingIndicator.js";
import { productState, productStore, resetProductState } from "../core/productState.js";
import { normalizeCategories } from "../utils/normalizeCategories.js";

let unsubscribe = null; // 구독 해제 함수
export const HomePage = () => {
  if (unsubscribe) {
    unsubscribe(); // 이전 구독 해제
    unsubscribe = null; // 초기화
  }
  // DOM이 준비된 뒤 상태 변경 → 렌더 업데이트 구독
  setTimeout(async () => {
    resetProductState(); // 상태 초기화
    bindFilterEvents();
    await loadCategories().then(loadProducts);
    unsubscribe = productStore.subscribe(handleStateChange); // unmount 시 해제 필요하면 반환값 사용
  }, 0);

  /* ---------- 구독 시 실행 ---------- */
  function handleStateChange() {
    console.log("상품 상태 변경:", productState.filters.limit);
    renderFilter();
    renderProducts();
  }

  /* ---------- 데이터 로딩 ---------- */
  async function loadCategories() {
    const res = await fetch("/api/categories");
    const raw = await res.json();
    productStore.setState({
      categories: normalizeCategories(raw),
      loadingCategories: false,
    });
  }

  async function loadProducts(page = 1) {
    const { filters } = productState; // Proxy 덕분에 최신값
    const qs = new URLSearchParams({
      page,
      limit: filters.limit,
      search: filters.search,
      category1: filters.category1,
      category2: filters.category2,
      sort: filters.sort,
    });
    const res = await fetch(`/api/products?${qs.toString()}`);
    const data = await res.json();

    productStore.setState({
      products: page === 1 ? data.products : [...productState.products, ...data.products],
      total: data.pagination.total,
    });
  }

  /* ---------- 렌더 ---------- */
  function renderFilter() {
    document.getElementById("filter-panel").innerHTML = ProductFilterPanel();
  }

  function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = productState.products.map(ProductCard).join("");

    const infoEl = document.getElementById("total-info");
    infoEl.innerHTML = `총 <span class="font-medium text-gray-900">${productState.total}개</span>의 상품`;
    infoEl.style.display = "block";
  }

  /* ---------- 이벤트 위임 ---------- */
  function bindFilterEvents() {
    const panel = document.getElementById("filter-panel");

    panel?.addEventListener("click", (e) => {
      const t = e.target;
      if (t.classList.contains("category1-filter-btn")) {
        productStore.setState({
          filters: { category1: t.dataset.category1, category2: "" },
        });
        loadProducts();
      }
      if (t.classList.contains("category2-filter-btn")) {
        productStore.setState({
          filters: { category1: t.dataset.category1, category2: t.dataset.category2 },
        });
        loadProducts();
      }
    });

    panel?.addEventListener("change", (e) => {
      const t = e.target;
      if (t.id === "limit-select") {
        productStore.setState({ filters: { limit: +t.value } });
        loadProducts();
      }
      if (t.id === "sort-select") {
        productStore.setState({ filters: { sort: t.value } });
        loadProducts();
      }
    });

    panel?.addEventListener("keydown", (e) => {
      const t = e.target;
      if (t.id === "search-input" && e.key === "Enter") {
        productStore.setState({ filters: { search: t.value.trim() } });
        loadProducts();
      }
    });

    /* ► 무한 스크롤 (예시)
       IntersectionObserver나 scroll 이벤트로 page++ 호출
       loadProducts(nextPage) 처럼 활용 가능 */
  }

  /* ---------- 최초 마크업 ---------- */
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${DefaultHeader()}
      <main class="max-w-md mx-auto px-4 py-4">
        <div id="filter-panel">${ProductFilterPanel()}</div>

        <div class="mb-6">
          <div class="mb-4 text-sm text-gray-600" id="total-info" style="display:none"></div>
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
