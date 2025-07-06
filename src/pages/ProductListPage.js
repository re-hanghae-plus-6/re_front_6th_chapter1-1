import { Header } from "../app/components/Header.js";
import { Footer } from "../app/components/Footer.js";
import { addEvent } from "../utils/eventManager.js";
import { ProductListSkeleton } from "../features/product/components/Skeleton.js";
import { ProductCard } from "../features/product/components/ProductCard.js";
import { productStore } from "../features/product/store/productStore.js";
import { getProducts, getCategories } from "../api/productApi.js";
import { getURLParams, updateURLParams } from "../utils/urlParams.js";

const defaultParams = {
  limit: 20,
  sort: "price_asc",
  search: "",
  category1: "",
  page: 1,
};

export const loadProducts = async (params = {}) => {
  productStore.setState({ loading: true });

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
      loading: false,
    });
  } catch (error) {
    console.error("상품 불러오기 실패:", error);
    productStore.setState({
      products: [],
      loading: false,
    });
  }
};

export const loadCategories = async () => {
  try {
    const categories = await getCategories();

    const categoryArray = [];
    if (categories && typeof categories === "object") {
      Object.keys(categories).forEach((categoryName) => {
        categoryArray.push({ name: categoryName });
      });
    }

    productStore.setState({ categories: categoryArray });
  } catch (error) {
    console.error("카테고리 불러오기 실패:", error);
    productStore.setState({ categories: [] });
  }
};

const renderProducts = (products) => {
  return products.map((product) => ProductCard(product)).join("");
};

const renderCategories = (categories) => {
  if (!categories || categories.length === 0) {
    return `<div class="text-sm text-gray-500 italic">카테고리를 불러오는 중...</div>`;
  }

  return categories
    .map(
      (category) => `
    <button 
      data-category1="${category.name}" 
      class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      ${category.name}
    </button>
  `,
    )
    .join("");
};

const eventHandlers = {
  "input:#search-input": (event) =>
    updateURLParams({ search: event.target.value, page: 1 }, defaultParams, loadProducts),
  "change:#sort-select": (event) => updateURLParams({ sort: event.target.value, page: 1 }, defaultParams, loadProducts),
  "change:#limit-select": (event) =>
    updateURLParams({ limit: parseInt(event.target.value), page: 1 }, defaultParams, loadProducts),
  "click:.category1-filter-btn": (event) =>
    updateURLParams(
      {
        category1: event.target.dataset.category1,
        page: 1,
      },
      defaultParams,
      loadProducts,
    ),
  'click:[data-breadcrumb="reset"]': () => updateURLParams({ category1: "", page: 1 }, defaultParams, loadProducts),
};

const initEventHandlers = () => {
  Object.entries(eventHandlers).forEach(([key, handler]) => {
    const [eventType, selector] = key.split(":");
    addEvent(eventType, selector, handler);
  });
};

const setupStateSubscriptions = () => {
  productStore.subscribe(() => {
    const $root = document.querySelector("#root");
    if ($root) {
      $root.innerHTML = ProductListPage();
    }
  });
};

export const ProductListPage = () => {
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
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${params.search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
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
              <!-- 카테고리 동적 표시 -->
              <div id="category-list" class="flex flex-wrap gap-2">
                ${
                  state.categories.length === 0
                    ? '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>'
                    : renderCategories(state.categories)
                }
              </div>
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10" ${params.limit === 10 ? "selected" : ""}>10개</option>
                  <option value="20" ${params.limit === 20 ? "selected" : ""}>20개</option>
                  <option value="50" ${params.limit === 50 ? "selected" : ""}>50개</option>
                  <option value="100" ${params.limit === 100 ? "selected" : ""}>100개</option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
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
          <div>
            ${
              state.loading
                ? ""
                : `
              <!-- 상품 개수 정보 -->
              <div id="product-count" class="mb-4 text-sm text-gray-600">
                총 <span class="font-medium text-gray-900">${state.pagination?.total || 0}개</span>의 상품
              </div>
            `
            }
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${state.loading ? ProductListSkeleton() : renderProducts(state.products)}
            </div>
            
            <!-- 하단 메시지 -->
            <div class="text-center py-4">
              ${
                state.loading
                  ? `
                <div class="inline-flex items-center">
                  <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
                </div>
              `
                  : `
                <div class="text-sm text-gray-500">
                  모든 상품을 확인했습니다
                </div>
              `
              }
            </div>
          </div>
        </div>
      </main>
      ${Footer()}
    </div>
  `;
};

ProductListPage.onMount = () => {
  setupStateSubscriptions();

  initEventHandlers();

  loadCategories();
  loadProducts(getURLParams(defaultParams));
};
