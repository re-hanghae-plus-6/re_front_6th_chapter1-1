import { getProducts, getCategories } from "../api/productApi";
import ProductItem from "../components/product/ProductItem";
import ProductFilter from "../components/product/ProductFilter";
import { ProductListLoading } from "../components/product/ProductLoading";

// 상태 관리 (컴포넌트 외부로 이동)
let products = [];
let totalCount = 0;
let isLoading = true;
let categories = {};
let isCategoriesLoading = true;

// 메인 컴포넌트
export const ProductList = () => {
  // 카테고리 로딩 함수
  async function loadCategories() {
    try {
      isCategoriesLoading = true;

      const response = await getCategories();

      categories = response;
      isCategoriesLoading = false;

      // DOM 업데이트
      updateProductList();
    } catch (error) {
      console.error("카테고리 로드 실패:", error);
      isCategoriesLoading = false;
    }
  }

  // 상품 로딩 함수
  async function loadProducts() {
    try {
      isLoading = true;
      const response = await getProducts({
        page: 1,
        limit: 20,
        search: "",
        category1: "",
        category2: "",
        sort: "price_asc",
      });

      products = response.products;
      totalCount = response.pagination.total;
      isLoading = false;

      // DOM 업데이트
      updateProductList();
    } catch (error) {
      console.error("상품 로드 실패:", error);
      isLoading = false;
    }
  }

  // DOM 업데이트 함수
  function updateProductList() {
    // ProductFilter 업데이트
    const filterContainer = document.getElementById("product-filter");
    if (filterContainer) {
      filterContainer.innerHTML = ProductFilter(categories, isCategoriesLoading);
    }

    const productsContainer = document.getElementById("products-grid");
    if (!productsContainer) return;

    if (isLoading) {
      productsContainer.innerHTML = ProductListLoading();
    } else {
      // 상품 목록 렌더링
      const productsHTML = products.map((product) => ProductItem(product)).join("");

      productsContainer.innerHTML = /* HTML */ `
        <div>
          <div class="mb-4 text-sm text-gray-600">
            총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">${productsHTML}</div>
        </div>
      `;
    }
  }

  // 초기화 함수
  function initialize() {
    // 카테고리와 상품을 동시에 로드
    loadCategories();
    loadProducts();
  }

  // 외부에서 호출할 수 있도록 init 함수를 컴포넌트에 추가
  ProductList.init = initialize;

  return /* HTML */ `
    <main class="max-w-md mx-auto px-4 py-4">
      <div id="product-filter">${ProductFilter(categories, isCategoriesLoading)}</div>
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div id="products-grid">${ProductListLoading()}</div>
      </div>
    </main>
  `;
};
