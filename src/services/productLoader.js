import { getCategories, getProducts } from "../api/productApi";
import ErrorContent from "../components/error/ErrorContent";
import ProductFilter from "../components/product/ProductFilter";
import ProductItem from "../components/product/ProductItem";
import { ProductListLoading } from "../components/product/ProductLoading";
import { initializeFilterEventListeners } from "../utils/productFilterUtils";

/**
 * @param {Object} query - { page, limit, search, category1, category2, sort }
 */
export const loadProductList = async (query) => {
  const productsContainer = document.getElementById("products-grid");
  if (!productsContainer) return;

  // 초기 로딩 UI 표시
  productsContainer.innerHTML = ProductListLoading();

  try {
    const { products, pagination } = await getProducts(query);

    const productListHTML = products.map((product) => ProductItem(product)).join("");

    productsContainer.innerHTML = /* HTML */ `
      <div>
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${pagination.total}개</span>의 상품
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">${productListHTML}</div>
      </div>
    `;
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

export const loadCategories = async (query = {}) => {
  const filterContainer = document.getElementById("product-filter");
  if (!filterContainer) return;

  const categoriesProps = {
    isLoading: true,
    categories: {},
    limit: query.limit || 20,
    sort: query.sort || "price_asc",
    search: query.search || "",
    selectedCategory1: query.selectedCategory1 || "",
    selectedCategory2: query.selectedCategory2 || "",
  };

  // 로딩 상태 표시
  filterContainer.innerHTML = ProductFilter(categoriesProps);

  try {
    const categories = await getCategories();
    filterContainer.innerHTML = ProductFilter({ ...categoriesProps, isLoading: false, categories });

    // HTML 렌더링 후 이벤트 리스너 등록
    initializeFilterEventListeners();
  } catch (error) {
    console.error("카테고리 로딩 실패:", error);

    filterContainer.innerHTML = ErrorContent("카테고리를 불러오지 못했습니다. 😥", "category-retry-button");

    // document.getElementById("category-retry-button")?.addEventListener("click", () => {
    //   loadCategories({ selectedCategory1, selectedCategory2 });
    // });
  }
};
