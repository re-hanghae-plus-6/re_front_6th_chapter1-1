import { render } from "../routes/router";
import { handleScroll } from "../eventhandler/handleScroll";
import { localState } from "../store/localState";
import { getQuery, updateURLFilters } from "../utils/queryFind";
import { cartModal } from "./cartPage";
import { CartClickHandler, productCardClickHandler } from "../eventhandler/handleClick";
export const bindEvents = () => {
  const limitSelect = document.querySelector("#limit-select");
  const sortSelect = document.querySelector("#sort-select");
  const inputSelect = document.querySelector("#search-input");
  const root = document.querySelector("#root");
  const cartBtn = document.querySelector("#cart-icon-btn");
  const cartCloseBtn = document.querySelector("#cart-modal-close-btn");

  const cartDisplayBtn = document.querySelector(".cart-modal-overlay");

  // 상세페이지 버튼

  root.removeEventListener("click", productCardClickHandler);
  root.addEventListener("click", productCardClickHandler);

  root.removeEventListener("click", CartClickHandler);
  root.addEventListener("click", CartClickHandler);
  // [1] 장바구니 버튼 - 이벤트 위임
  // root.addEventListener("click", (e) => {
  //   if (e.target.matches(".add-to-cart-btn")) {
  //     e.stopPropagation();
  //     const productCard = e.target.closest(".product-card");
  //     if (productCard) {
  //       const product = {
  //         productId: e.target.getAttribute("data-product-id"),
  //         title: productCard.querySelector("h3").textContent,
  //         image: productCard.querySelector("img").src,
  //         price: productCard.querySelector(".text-lg").textContent.replace("원", "").replace(",", ""),
  //       };
  //       addCart(product);
  //     }
  //   }
  // });

  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);
  if (limitSelect) {
    limitSelect.addEventListener("change", (e) => {
      pageState.limit = Number(e.target.value);
      pageState.page = 1; // 페이지도 초기화
      state.products = []; // 안전하게 초기화
      updateURLFilters();
      getProducts(true); // true 전달해서 초기화
    });
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        filterState.sort = e.target.value;
        pageState.page = 1; // 페이지도 초기화
        state.products = []; // 안전하게 초기화
        updateURLFilters();
        getProducts(true); // true 전달해서 초기화
      });
    }

    if (inputSelect) {
      inputSelect.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          filterState.search = e.target.value;
          pageState.page = 1; // 페이지도 초기화
          state.products = []; // 안전하게 초기화
          updateURLFilters();
          getProducts(true);
        }
      });
    }

    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        state.modalView = true;
        console.log(state.modalView);
        render();
      });
    }
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener("click", () => {
        state.modalView = false;
        render();
      });
    }
    if (cartDisplayBtn) {
      cartDisplayBtn.addEventListener("click", () => {
        state.modalView = false;
        render();
      });
    }
  }
};

export let pageState = {
  hasNext: false,
  hasPrev: false,
  limit: 20,
  page: 1,
  total: 0,
  totalPages: 0,
};

export let filterState = {
  category1: "",
  category2: "",
  search: "",
  sort: "price_asc",
};

export let state = {
  isLoading: false,
  isFetching: false,
  error: null,
  products: [],
  hasSearched: false, //
  modalView: false,
};

export async function getProducts() {
  const { limit, page } = pageState;
  const { search, sort, category1, category2 } = filterState;
  const searchParams = { limit, page, search, sort, category1, category2 };
  state.isLoading = true;
  state.hasSearched = true;
  // render();
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(([k, v]) => v !== undefined && v !== null && k),
  );
  try {
    const response = await fetch(`/api/products?${params.toString()}`);

    // console.log("response:",response.json())

    if (!response.ok) throw new Error("네트워크 오류");
    const data = await response.json();
    const { products, pagination, filters } = data;

    if (products.length === 0) {
      pageState.hasNext = false;
    }
    console.log("data", data.products.length);

    state.products = [...state.products, ...products];
    pageState = { ...pageState, ...pagination };
    filterState = { ...filterState, ...filters };
    // console.log("data:", data);
    console.log(pageState);
    state.error = null;
  } catch (error) {
    state.error = error.message;
  } finally {
    state.isLoading = false;
    state.isFetching = false;
    render();
  }
}

export function productPage() {
  if (!state.isLoading && state.products.length === 0 && !state.hasSearched) {
    const query = getQuery();
    filterState.search = query.search || "";
    filterState.sort = query.sort || "price_asc";
    filterState.category1 = query.category1 || "";
    filterState.category2 = query.category2 || "";

    // pageState 설정
    pageState.limit = Number(query.limit) || 20;
    pageState.page = Number(query.page) || 1;

    getProducts(true); // 최초 호출 시 데이터 요청
  }
  return state.isLoading ? loadingContent() : productContent();
}
export function productItem() {
  if (state.products.length === 0 && !state.isLoading) {
    return `<div class="text-center text-gray-500 col-span-2 py-8">상품이 없습니다.</div>`;
  }
  return /* HTML */ state.products
    .map(
      (product) => `<div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
    data-product-id="${product.productId}"
  >
    <!-- 상품 이미지 -->
    <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
      <img
        src="${product.image || ""}"
        alt="${product.title || ""}"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        loading="lazy"
      />
    </div>
    <!-- 상품 정보 -->
    <div class="p-3">
      <div class="cursor-pointer product-info mb-3">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title || ""}</h3>
        <p class="text-xs text-gray-500 mb-2">${product.brand}</p>
      <p class="text-lg font-bold text-gray-900">${Number(product.lprice || 0).toLocaleString()}원</p>
      </div>
      <!-- 장바구니 버튼 -->
      <button
        class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn"
        data-product-id=${product.productId}
      >
        장바구니 담기
      </button>
    </div>
  </div> `,
    )
    .join("");
}
function productContent() {
  // bindEvents();
  return /* HTML */ `
    <div class="bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/front_6th_chapter1-1/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                  ></path>
                </svg>
                ${localState.items.length
                  ? `                <span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >${localState.items.length}</span
                >`
                  : ""}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input
                type="text"
                id="search-input"
                placeholder="상품명을 검색해보세요..."
                value="${filterState.search}"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
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
                <button
                  data-category1="생활/건강"
                  class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  생활/건강
                </button>
                <button
                  data-category1="디지털/가전"
                  class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  디지털/가전
                </button>
              </div>
              <!-- 2depth 카테고리 -->
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select
                  id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10" ${pageState.limit == 10 ? "selected" : ""}>10개</option>
                  <option value="20" ${pageState.limit == 20 ? "selected" : ""}>20개</option>
                  <option value="50" ${pageState.limit == 50 ? "selected" : ""}>50개</option>
                  <option value="100" ${pageState.limit == 100 ? "selected" : ""}>100개</option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select
                  id="sort-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="price_asc" ${filterState.sort == "price_asc" ? "selected" : ""}>가격 낮은순</option>
                  <option value="price_desc" ${filterState.sort == "price_desc" ? "selected" : ""}>가격 높은순</option>
                  <option value="name_asc" ${filterState.sort == "name_asc" ? "selected" : ""}>이름순</option>
                  <option value="name_desc" ${filterState.sort == "name_desc" ? "selected" : ""}>이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${pageState.total || 0}개</span>의 상품
            </div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">${productItem()}</div>
            <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
          </div>
        </div>
      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
        ${state.modalView && cartModal(localState.items.length)}
      </footer>
    </div>
  `;
}

function loadingContent() {
  return `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                  ></path>
                </svg>${
                  localState.items.length
                    ? `<span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >${localState.items.length}</span
                >`
                    : ""
                }
                    
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input
                type="text"
                id="search-input"
                placeholder="상품명을 검색해보세요..."
                value=""
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
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
                <select
                  id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10" ${pageState.limit == 10 ? "selected" : ""}>10개</option>
                  <option value="20" ${pageState.limit == 20 ? "selected" : ""}>20개</option>
                  <option value="50" ${pageState.limit == 50 ? "selected" : ""}>50개</option>
                  <option value="100" ${pageState.limit == 100 ? "selected" : ""}>100개</option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select
                  id="sort-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="price_asc" ${filterState.sort == "price_asc" ? "selected" : ""}>가격 낮은순</option>
                  <option value="price_desc" ${filterState.sort == "price_desc" ? "selected" : ""}>가격 높은순</option>
                  <option value="name_asc" ${filterState.sort == "name_asc" ? "selected" : ""}>이름순</option>
                  <option value="name_desc" ${filterState.sort == "name_desc" ? "selected" : ""}>이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              <!-- 로딩 스켈레톤 -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
  `;
}
