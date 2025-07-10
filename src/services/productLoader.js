import { getCategories, getProducts } from "../api/productApi";
import ErrorContent from "../components/error/ErrorContent";
import { ProductEmpty } from "../components/product/ProductEmpty";
import ProductFilter from "../components/product/ProductFilter";
import ProductItem from "../components/product/ProductItem";
import { InfiniteScrollSpinner } from "../components/product/ProductLoading";
import { CartStorage } from "../utils/CartStorage";

import { createCategoryCache, initializeFilterEventListeners } from "../utils/productFilterUtils";

/**
 * 장바구니 버튼 이벤트 리스너 연결
 */
function initializeCartEventListeners() {
  // 기존 이벤트 리스너 제거 (중복 방지)
  document.removeEventListener("click", handleCartButtonClick);
  // 새 이벤트 리스너 추가 (이벤트 위임)
  document.addEventListener("click", handleCartButtonClick);
}

/**
 * 장바구니 버튼 클릭 핸들러
 */
function handleCartButtonClick(event) {
  if (event.target.classList.contains("add-to-cart-btn")) {
    const productId = event.target.getAttribute("data-product-id");
    if (productId) {
      const productCard = event.target.closest(".product-card");
      if (productCard) {
        const product = {
          productId: productId,
          title: productCard.querySelector("h3")?.textContent || "",
          image: productCard.querySelector("img")?.src || "",
          lprice: parseInt(productCard.querySelector(".text-lg")?.textContent?.replace(/[^\d]/g, "") || "0"),
          brand: productCard.querySelector(".text-xs")?.textContent || "",
        };

        CartStorage.save(product);
      }
    }
  }
}

// 무한 스크롤 상태 관리
let currentPage = 1;
let isLoading = false;
let hasMore = true;

/**
 * 스크롤이 페이지 하단에 도달했는지 확인하는 함수
 */
function isNearBottom() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 페이지 하단 100px 전에 도달했을 때 로드 시작
  return scrollTop + windowHeight >= documentHeight - 100;
}

/**
 * 스크롤 이벤트 핸들러
 */
function handleScroll() {
  if (isLoading || !hasMore) return;

  if (isNearBottom()) {
    loadMoreProducts();
  }
}

/**
 * 추가 상품을 로드하는 함수
 */
async function loadMoreProducts() {
  if (isLoading || !hasMore) return;

  isLoading = true;
  currentPage++;

  // 로딩 스피너 추가
  const productsContainer = document.getElementById("products-grid");
  if (productsContainer) {
    const loadingSpinner = document.createElement("div");
    loadingSpinner.innerHTML = InfiniteScrollSpinner();
    productsContainer.appendChild(loadingSpinner);
  }

  try {
    // 현재 필터 상태 가져오기
    const searchInput = document.querySelector("#search-input");
    const limitSelect = document.querySelector("#limit-select");
    const sortSelect = document.querySelector("#sort-select");

    const query = {
      page: currentPage,
      limit: parseInt(limitSelect?.value) || 20,
      search: searchInput?.value || "",
      sort: sortSelect?.value || "price_asc",
    };

    const { products, pagination } = await getProducts(query);

    if (!products || products.length === 0) {
      hasMore = false;
      return;
    }

    // 기존 로딩 스피너 제거
    const existingSpinner = document.querySelector(".text-center.py-4");
    if (existingSpinner) {
      existingSpinner.remove();
    }

    // 새 상품들을 기존 목록에 추가
    const productListHTML = products.map((product) => ProductItem(product)).join("");
    const productsGrid = document.querySelector("#products-grid .grid");

    if (productsGrid) {
      productsGrid.insertAdjacentHTML("beforeend", productListHTML);
    }

    // 더 이상 로드할 상품이 없는지 확인
    if (currentPage >= pagination.totalPages) {
      hasMore = false;
    }
  } catch (error) {
    console.error("추가 상품 불러오기 실패:", error);
    currentPage--; // 실패 시 페이지 번호 되돌리기
  } finally {
    isLoading = false;
  }
}

/**
 * @param {Object} query - { page, limit, search, category1, category2, sort }
 */
export const loadProductList = async (query) => {
  const productsContainer = document.getElementById("products-grid");
  if (!productsContainer) return;

  // 무한 스크롤 상태 초기화
  currentPage = 1;
  isLoading = false;
  hasMore = true;

  try {
    const { products, pagination } = await getProducts(query);

    // 상품이 없는 경우 빈 상태 UI 표시
    if (!products || products.length === 0) {
      productsContainer.innerHTML = ProductEmpty(query.search);
      return;
    }

    const productListHTML = products.map((product) => ProductItem(product)).join("");

    productsContainer.innerHTML = /* HTML */ `
      <div>
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${pagination.total}개</span>의 상품
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">${productListHTML}</div>
      </div>
    `;

    // 장바구니 버튼 이벤트 리스너 연결
    initializeCartEventListeners();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);
  } catch (error) {
    console.error("상품 불러오기 실패:", error);

    // 에러 UI 표시
    productsContainer.innerHTML = ErrorContent("상품 정보를 불러올 수 없어요. 😥", "product-retry-button");

    // 재시도 이벤트 연결
    const retryButton = document.getElementById("product-retry-button");
    retryButton?.addEventListener("click", () => {
      loadProductList(query); // 다시 시도
    });
  }
};

const categoryCache = createCategoryCache();

export const loadFilter = async (query = {}) => {
  const filterContainer = document.getElementById("product-filter");
  if (!filterContainer) return;

  const categoriesProps = {
    isLoading: true,
    categories: {},
    limit: query.limit || 20,
    sort: query.sort || "price_asc",
    search: query.search || "",
    category1: query.category1 || "",
    category2: query.category2 || "",
  };

  // 로딩 상태 표시
  filterContainer.innerHTML = ProductFilter(categoriesProps);

  try {
    // 캐시된 카테고리가 있으면 사용, 없으면 새로 로드
    let categories;
    if (categoryCache.has()) {
      categories = categoryCache.get();
    } else {
      categories = await getCategories();
      categoryCache.set(categories);
    }

    filterContainer.innerHTML = ProductFilter({ ...categoriesProps, isLoading: false, categories });

    // HTML 렌더링 후 이벤트 리스너 등록
    initializeFilterEventListeners();
  } catch (error) {
    console.error("카테고리 로딩 실패:", error);

    filterContainer.innerHTML = ErrorContent("카테고리를 불러오지 못했습니다. 😥", "category-retry-button");

    document.getElementById("category-retry-button")?.addEventListener("click", () => {
      loadFilter({ ...categoriesProps });
    });
  }
};
