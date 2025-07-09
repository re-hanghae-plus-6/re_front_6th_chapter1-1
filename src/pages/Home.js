import ProductCard from "../components/product/ProductCard";
import ProductSkeleton, { ProductLoadingIndicator } from "../components/product/ProductSkeleton";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getProducts } from "../api/productApi.js";
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

  function mount() {
    renderProducts();
    loadProducts({ append: false });

    function filterReset({ search, limit, sort }) {
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

      updateQueryParams(newParams);

      productStore.setPage(1);
      productStore.setHasMore(true);
      loadProducts({ append: false });
    }

    // 뒤로가기/앞으로가기 처리
    window.addEventListener("popstate", () => {
      const params = getQueryParams();
      productStore.setSearch(params.search);
      productStore.setLimit(params.limit);
      productStore.setSort(params.sort);
      productStore.setPage(1);
      productStore.setHasMore(true);
      loadProducts({ append: false });
    });

    const limitSelect = document.getElementById("limit-select");
    if (limitSelect) {
      limitSelect.addEventListener("change", (e) => {
        const newLimit = parseInt(e.target.value);
        filterReset({ limit: newLimit });
      });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        const newSort = e.target.value;
        filterReset({ sort: newSort });
      });
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const searchTerm = e.target.value.trim();
          filterReset({ search: searchTerm });
        }
      });
    }

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

    const unsubscribe = productStore.subscribe(renderProducts);
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }

  return { template, mount };
}
