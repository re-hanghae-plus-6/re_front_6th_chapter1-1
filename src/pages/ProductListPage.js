import { Header } from "../app/components/Header.js";
import { Footer } from "../app/components/Footer.js";
import { ProductCard } from "../features/product/components/ProductCard.js";
import { ProductListSkeleton } from "../features/product/components/Skeleton.js";
import { productStore } from "../features/product/store/productStore.js";
import { getProducts, getCategories } from "../api/productApi.js";
import { getURLParams, updateURLParams } from "../utils/urlParams.js";
import { addEvent } from "../utils/eventManager.js";
import { router } from "../router.js";
import { updateElement, createComponent } from "../utils/domUtils.js";
import { setupInfiniteScroll } from "../utils/infiniteScroll.js";
import { addToCart } from "../features/cart/services/cartService.js";
import { showSuccessToast, showErrorToast } from "../utils/toastManager.js";

const defaultParams = {
  limit: 20,
  sort: "price_asc",
  search: "",
  category1: "",
  category2: "",
  page: 1,
};

export const loadProducts = async (params = {}) => {
  productStore.setState({ isLoading: true, error: null });

  try {
    const response = await getProducts(params);

    productStore.setState({
      products: response.products || [],
      pagination: response.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      isLoading: false,
      error: null,
    });
  } catch (error) {
    console.error("상품 불러오기 실패:", error);
    showErrorToast("상품을 불러오는데 실패했습니다. 다시 시도해주세요.");
    productStore.setState({
      products: [],
      isLoading: false,
      error: error.message || "상품 로딩에 실패했습니다.",
    });
  }
};

export const loadMoreProducts = async (params = {}) => {
  const currentState = productStore.getState();

  if (currentState.isLoadingMore || !currentState.pagination.hasNext) {
    return;
  }

  productStore.setState({ isLoadingMore: true });

  try {
    const response = await getProducts({ ...params, page: currentState.pagination.page + 1 });

    productStore.setState({
      products: [...currentState.products, ...(response.products || [])],
      pagination: response.pagination || currentState.pagination,
      isLoadingMore: false,
    });
  } catch (error) {
    console.error("추가 상품 불러오기 실패:", error);
    showErrorToast("추가 상품을 불러오는데 실패했습니다.");
    productStore.setState({
      isLoadingMore: false,
    });
  }
};

const renderProducts = (products) => {
  return products.map((product) => ProductCard(product)).join("");
};

const renderCategoryBreadcrumb = (selectedCategory1, category2) => {
  let breadcrumb = `
    <label class="text-sm text-gray-600">카테고리:</label>
    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
  `;

  if (selectedCategory1) {
    breadcrumb += `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${selectedCategory1}</button>`;
  }

  if (category2) {
    breadcrumb += `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${category2}</span>`;
  }

  return breadcrumb;
};

const renderCategories = (categories, selectedCategory1) => {
  if (!categories || typeof categories !== "object" || Object.keys(categories).length === 0) {
    return '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>';
  }

  if (!selectedCategory1) {
    return Object.keys(categories)
      .map(
        (categoryName) => `
        <button 
          data-category1="${categoryName}" 
          class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ${categoryName}
        </button>
      `,
      )
      .join("");
  }

  const subCategories = categories[selectedCategory1];
  if (!subCategories || typeof subCategories !== "object") {
    return '<div class="text-sm text-gray-500 italic">하위 카테고리가 없습니다</div>';
  }

  const currentParams = getURLParams(defaultParams);
  const selectedCategory2 = currentParams.category2;

  return Object.keys(subCategories)
    .map((subCategoryName) => {
      const isSelected = subCategoryName === selectedCategory2;
      const buttonClass = isSelected
        ? "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-blue-100 border-blue-300 text-blue-800"
        : "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

      return `
        <button 
          data-category1="${selectedCategory1}" 
          data-category2="${subCategoryName}" 
          class="${buttonClass}"
        >
          ${subCategoryName}
        </button>
      `;
    })
    .join("");
};

const renderLoadingMessage = () => `
  <div class="inline-flex items-center">
    <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
  </div>
`;

const renderErrorContent = (errorMessage) => `
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
    <div class="text-red-500 mb-4">
      <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">데이터를 불러올 수 없습니다</h3>
    <p class="text-gray-600 mb-4">${errorMessage}</p>
    <button id="retry-button" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
      다시 시도
    </button>
  </div>
`;

const renderProductCount = (state) => {
  if (state.isLoading) return "";
  return `총 <span class="font-medium text-gray-900">${state.pagination?.total || 0}개</span>의 상품`;
};

const renderProductListPage = () => {
  const state = productStore.getState();
  const params = getURLParams(defaultParams);

  return `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${params.search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2" id="category-breadcrumb">
                ${renderCategoryBreadcrumb(params.category1, params.category2)}
              </div>
              ${
                params.category1
                  ? `
              <div class="space-y-2">
                <div id="category-list" class="flex flex-wrap gap-2">
                  ${renderCategories(state.categories, params.category1)}
                </div>
              </div>
              `
                  : `
              <div id="category-list" class="flex flex-wrap gap-2">
                ${renderCategories(state.categories, params.category1)}
              </div>
              `
              }
            </div>
            
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10" ${params.limit === 10 ? "selected" : ""}>10개</option>
                  <option value="20" ${params.limit === 20 ? "selected" : ""}>20개</option>
                  <option value="50" ${params.limit === 50 ? "selected" : ""}>50개</option>
                  <option value="100" ${params.limit === 100 ? "selected" : ""}>100개</option>
                </select>
              </div>
              
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" ${params.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                  <option value="price_desc" ${params.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                  <option value="name_asc" ${params.sort === "name_asc" ? "selected" : ""}>이름순</option>
                  <option value="name_desc" ${params.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div id="product-count" class="mb-4 text-sm text-gray-600">
            ${renderProductCount(state)}
          </div>
          
          <!-- 상품 그리드 -->
          <div class="mb-6" id="products-grid">
            ${state.isLoading ? `<div class="grid grid-cols-2 gap-4">${ProductListSkeleton()}</div>` : state.error ? renderErrorContent(state.error) : `<div class="grid grid-cols-2 gap-4">${renderProducts(state.products)}</div>`}
          </div>
          
          <!-- 하단 메시지 -->
          <div class="text-center py-4 bottom-message">
            ${
              state.isLoading
                ? renderLoadingMessage()
                : state.isLoadingMore
                  ? renderLoadingMessage()
                  : state.pagination?.hasNext
                    ? '<div class="text-sm text-gray-500">더 많은 상품을 보려면 스크롤하세요</div>'
                    : '<div class="text-sm text-gray-500">모든 상품을 확인했습니다</div>'
            }
          </div>
        </div>
      </main>
      ${Footer()}
    </div>
  `;
};

const setupStateSubscription = () => {
  return productStore.subscribe((newState, prevState) => {
    if (!prevState || newState.categories !== prevState.categories) {
      const currentParams = getURLParams(defaultParams);
      updateElement("#category-list", renderCategories(newState.categories, currentParams.category1));
      updateElement("#category-breadcrumb", renderCategoryBreadcrumb(currentParams.category1, currentParams.category2));
    }

    if (
      !prevState ||
      newState.products !== prevState.products ||
      newState.isLoading !== prevState.isLoading ||
      newState.error !== prevState.error
    ) {
      updateElement(
        "#products-grid",
        newState.isLoading
          ? `<div class="grid grid-cols-2 gap-4">${ProductListSkeleton()}</div>`
          : newState.error
            ? renderErrorContent(newState.error)
            : `<div class="grid grid-cols-2 gap-4">${renderProducts(newState.products)}</div>`,
      );
    }

    updateElement("#product-count", renderProductCount(newState));

    if (
      !prevState ||
      newState.isLoading !== prevState.isLoading ||
      newState.isLoadingMore !== prevState.isLoadingMore ||
      newState.pagination !== prevState.pagination
    ) {
      const bottomMessage = newState.isLoading
        ? renderLoadingMessage()
        : newState.isLoadingMore
          ? renderLoadingMessage()
          : newState.pagination?.hasNext
            ? '<div class="text-sm text-gray-500">더 많은 상품을 보려면 스크롤하세요</div>'
            : '<div class="text-sm text-gray-500">모든 상품을 확인했습니다</div>';

      updateElement(".bottom-message", bottomMessage);
    }
  });
};

const setupEventHandlers = () => {
  addEvent("input", "#search-input", (event) => {
    updateURLParams({ search: event.target.value, page: 1 }, defaultParams, loadProducts);
  });

  addEvent("change", "#sort-select", (event) => {
    updateURLParams({ sort: event.target.value, page: 1 }, defaultParams, loadProducts);
  });

  addEvent("change", "#limit-select", (event) => {
    updateURLParams({ limit: parseInt(event.target.value), page: 1 }, defaultParams, loadProducts);
  });

  addEvent("click", ".category1-filter-btn", (event) => {
    const category1 = event.target.dataset.category1;
    updateURLParams({ category1, category2: "", page: 1 }, defaultParams, loadProducts);

    const currentParams = getURLParams(defaultParams);
    const categories = productStore.getState().categories;
    updateElement("#category-list", renderCategories(categories, currentParams.category1));
    updateElement("#category-breadcrumb", renderCategoryBreadcrumb(currentParams.category1, currentParams.category2));
  });

  addEvent("click", ".category2-filter-btn", (event) => {
    const category1 = event.target.dataset.category1;
    const category2 = event.target.dataset.category2;
    updateURLParams({ category1, category2, page: 1 }, defaultParams, loadProducts);

    const currentParams = getURLParams(defaultParams);
    const categories = productStore.getState().categories;
    updateElement("#category-list", renderCategories(categories, currentParams.category1));
    updateElement("#category-breadcrumb", renderCategoryBreadcrumb(currentParams.category1, currentParams.category2));
  });

  addEvent("click", '[data-breadcrumb="reset"]', () => {
    updateURLParams({ category1: "", category2: "", page: 1 }, defaultParams, loadProducts);

    const currentParams = getURLParams(defaultParams);
    const categories = productStore.getState().categories;
    updateElement("#category-list", renderCategories(categories, currentParams.category1));
    updateElement("#category-breadcrumb", renderCategoryBreadcrumb(currentParams.category1, currentParams.category2));
  });

  addEvent("click", '[data-breadcrumb="category1"]', () => {
    const currentParams = getURLParams(defaultParams);
    updateURLParams({ category1: currentParams.category1, category2: "", page: 1 }, defaultParams, loadProducts);

    const newParams = getURLParams(defaultParams);
    const categories = productStore.getState().categories;
    updateElement("#category-list", renderCategories(categories, newParams.category1));
    updateElement("#category-breadcrumb", renderCategoryBreadcrumb(newParams.category1, newParams.category2));
  });

  addEvent("click", ".add-to-cart-btn", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const productId = event.target.dataset.productId;
    const products = productStore.getState().products;
    const product = products.find((p) => (p.productId || p.id) === productId);

    if (product) {
      addToCart(product, 1);
      showSuccessToast("장바구니에 추가되었습니다");
    }
  });

  addEvent("click", ".product-card", (event) => {
    if (event.target.closest(".add-to-cart-btn")) return;

    const productCard = event.target.closest(".product-card");
    const productId = productCard?.dataset?.productId;
    if (productId) {
      router.get().push(`/product/${productId}`);
    }
  });

  addEvent("click", "#retry-button", () => {
    const currentParams = getURLParams(defaultParams);
    loadProducts(currentParams);
  });
};

const setupProductInfiniteScroll = () => {
  return setupInfiniteScroll({
    onLoadMore: () => {
      const currentParams = getURLParams(defaultParams);
      loadMoreProducts(currentParams);
    },
    threshold: 100,
    shouldLoad: () => {
      const state = productStore.getState();
      return !state.isLoadingMore && state.pagination?.hasNext;
    },
  });
};

const loadProductListPageInitialData = async (params) => {
  try {
    productStore.setState({ isLoading: true });

    const [categoriesResult, productsResult] = await Promise.all([getCategories(), getProducts(params)]);

    productStore.setState({
      categories: categoriesResult,
      products: productsResult.products || [],
      pagination: productsResult.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      isLoading: false,
    });
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
    showErrorToast("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
    productStore.setState({
      categories: {},
      products: [],
      isLoading: false,
      error: error.message || "데이터 로딩에 실패했습니다.",
    });
  }
};

let storeUnsubscribe = null;
let infiniteScrollCleanup = null;

const setupPageComponents = () => {
  storeUnsubscribe = setupStateSubscription();
  setupEventHandlers();
  infiniteScrollCleanup = setupProductInfiniteScroll();
};

export const ProductListPage = createComponent(
  renderProductListPage,
  {},
  {
    mount: async () => {
      const currentParams = getURLParams(defaultParams);
      setupPageComponents();
      await loadProductListPageInitialData(currentParams);
    },
    unmount: () => {
      if (storeUnsubscribe) {
        storeUnsubscribe();
        storeUnsubscribe = null;
      }

      if (infiniteScrollCleanup) {
        infiniteScrollCleanup();
        infiniteScrollCleanup = null;
      }
    },
  },
);
