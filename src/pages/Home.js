import ProductCard from "../components/product/ProductCard";
import ProductSkeleton, { ProductLoadingIndicator } from "../components/product/ProductSkeleton";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getProducts, getCategories } from "../api/productApi.js";
import { productStore } from "../store/productStore.js";
import ProductFilter from "../components/product/ProductFilter.js";
import { getQueryParams, updateQueryParams } from "../utils/urlParam.js";

function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  const totalCountContainer = document.getElementById("total-count-container");

  const state = productStore.getState();

  if (!productsGrid) return;

  if (state.loading && state.hasMore) {
    productsGrid.innerHTML = `${Array(6).fill().map(ProductSkeleton).join("")}${ProductLoadingIndicator()}`;
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

async function loadProducts({ append = false }) {
  productStore.setLoading(true);
  productStore.setError(null);
  try {
    const state = productStore.getState();
    const response = await getProducts({
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      page: state.page,
      category1: state.category1,
      category2: state.category2,
    });

    if (response.products) {
      productStore.setProducts(response.products, append);
      productStore.setTotalCount(response.pagination?.total ?? response.products.length);

      // 무한스크롤
      const total = response.pagination?.total ?? 0;
      const currentProductsLength = append
        ? state.products.length + response.products.length
        : response.products.length;
      const hasMore = currentProductsLength < total;
      productStore.setHasMore(hasMore);

      if (hasMore) {
        productStore.setPage(state.page + 1);
      }
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
  const initialParams = getQueryParams();
  productStore.setSearch(initialParams.search);
  productStore.setLimit(initialParams.limit);
  productStore.setSort(initialParams.sort);
  productStore.setCategory1(initialParams.category1);
  productStore.setCategory2(initialParams.category2);

  const template = `
    ${Header()}
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          <div id="total-count-container" class="mb-4 text-sm text-gray-600">

          </div>
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
          
          <!-- 무한 스크롤 타겟 -->
          <div id="observer-target"></div>

          <div class="text-center py-4 text-sm text-gray-500">
            모든 상품을 확인했습니다
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  async function mount() {
    const categories = await getCategories();
    productStore.setCategories(categories);

    renderFilter();
    renderProducts();
    loadProducts({ append: false });

    function renderFilter() {
      const filterContainer = document.querySelector("main");
      if (!filterContainer) return;

      const oldFilter = filterContainer.querySelector("#product-filter");
      if (oldFilter) oldFilter.remove();

      const filterHTML = ProductFilter({ state: productStore.getState() });

      filterContainer.insertAdjacentHTML("afterbegin", filterHTML);
    }

    function filterReset({ search, limit, sort, category1, category2 }) {
      const newParams = {};
      if (search !== undefined) {
        productStore.setSearch(search);
        newParams.search = search;
      }
      if (limit !== undefined) {
        productStore.setLimit(limit);
        newParams.limit = limit;
      }
      if (sort !== undefined) {
        productStore.setSort(sort);
        newParams.sort = sort;
      }
      if (category1 !== undefined) {
        productStore.setCategory1(category1);
        newParams.category1 = category1;
      }
      if (category2 !== undefined) {
        productStore.setCategory2(category2);
        newParams.category2 = category2;
      }

      updateQueryParams(newParams);

      productStore.setPage(1);
      productStore.setHasMore(true);
      loadProducts({ append: false });
      renderFilter();
    }

    // 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      const params = getQueryParams();
      productStore.setSearch(params.search);
      productStore.setLimit(params.limit);
      productStore.setSort(params.sort);
      productStore.setCategory1(params.category1);
      productStore.setCategory2(params.category2);
      productStore.setPage(1);
      productStore.setHasMore(true);
      loadProducts({ append: false });
      renderFilter();
    });

    // 이벤트 위임 필터 이벤트 처리
    document.addEventListener("change", (e) => {
      if (e.target.id === "limit-select") {
        const newLimit = parseInt(e.target.value);
        filterReset({ limit: newLimit });
      }
      if (e.target.id === "sort-select") {
        const newSort = e.target.value;
        filterReset({ sort: newSort });
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.target.id === "search-input" && e.key === "Enter") {
        const searchTerm = e.target.value.trim();
        filterReset({ search: searchTerm });
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("category1-filter-btn")) {
        const category1 = e.target.dataset.category1;
        filterReset({ category1, category2: "" });
      }
      if (e.target.classList.contains("category2-filter-btn")) {
        const category2 = e.target.dataset.category2;
        const state = productStore.getState();
        filterReset({ category1: state.category1, category2 });
      }
      if (e.target.dataset.breadcrumb === "reset") {
        filterReset({ category1: "", category2: "" });
      }
      if (e.target.dataset.breadcrumb === "category1") {
        const category1 = e.target.dataset.category1;
        filterReset({ category1, category2: "" });
      }
      if (e.target.dataset.breadcrumb === "category2") {
        const category2 = e.target.dataset.category2;
        const state = productStore.getState();
        filterReset({ category1: state.category1, category2 });
      }
    });

    const observerTarget = document.getElementById("observer-target");

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        const state = productStore.getState();

        if (entry.isIntersecting && !state.loading && state.hasMore) {
          await loadProducts({ append: true });
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    const unsubscribe = productStore.subscribe(() => {
      renderProducts();
      renderFilter();
    });
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }

  return { template, mount };
}
