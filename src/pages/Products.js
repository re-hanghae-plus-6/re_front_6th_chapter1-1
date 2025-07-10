import { getCategories, getProducts } from "../api/productApi";
import FilterSection from "../components/product/list/FilterSection";
import Layout from "../components/product/list/Layout";
import ProductList from "../components/product/list/ProductList";
import { router } from "../routes";

function Products() {
  let currentCategories = {};
  const unsubscribeFunctions = [];

  const updateProductsUI = ({ products }) => {
    const productListElement = document.getElementById("products-grid");
    if (productListElement) {
      productListElement.replaceWith(ProductList({ products, loading: false }));
    }
  };

  const updateTotalProductsCountUI = ({ count }) => {
    const totalProductsCountContainer = document.getElementById("total-products-count");
    if (totalProductsCountContainer) {
      totalProductsCountContainer.innerHTML = `총 <span class="font-medium text-gray-900">${count}개</span>의 상품`;
    }
  };

  const updateFilterSectionUI = ({ categories }) => {
    const filterSectionContainer = document.getElementById("filter-section-container");
    if (!filterSectionContainer) return;

    const { category1, category2 } = router.getSearchParams();

    filterSectionContainer.innerHTML = FilterSection({
      loading: false,
      categories,
      selectedCategory1: category1,
      selectedCategory2: category2,
    });

    // 이벤트 리스너 재바인딩
    setupCategoryEventListeners();
  };

  const setupCategoryEventListeners = () => {
    const filterSectionContainer = document.getElementById("filter-section-container");

    // DOM 요소가 존재하지 않으면 리턴
    if (!filterSectionContainer) {
      return;
    }

    // 카테고리 버튼 클릭 이벤트
    filterSectionContainer.addEventListener("click", (event) => {
      const target = event.target;

      // 1depth 카테고리 버튼
      if (target.hasAttribute("data-category1") && !target.hasAttribute("data-category2")) {
        const category1 = target.getAttribute("data-category1");
        handleCategorySelect(category1, null);
      }

      // 2depth 카테고리 버튼
      if (target.hasAttribute("data-category1") && target.hasAttribute("data-category2")) {
        const category1 = target.getAttribute("data-category1");
        const category2 = target.getAttribute("data-category2");
        handleCategorySelect(category1, category2);
      }

      // 브레드크럼 클릭
      if (target.hasAttribute("data-breadcrumb")) {
        const breadcrumbType = target.getAttribute("data-breadcrumb");
        if (breadcrumbType === "reset") {
          handleBreadcrumbClick(0);
        } else if (breadcrumbType === "category1") {
          handleBreadcrumbClick(1);
        }
      }
    });
  };

  const handleCategorySelect = (newCategory1, newCategory2) => {
    router.updateSearchParams({
      category1: newCategory1,
      category2: newCategory2,
      page: 1, // 카테고리 변경 시 첫 페이지로 이동
    });
  };

  const handleBreadcrumbClick = (targetDepth) => {
    const { category1: current1 } = router.getSearchParams();

    if (targetDepth === 0) {
      router.updateSearchParams({ category1: null, category2: null, page: 1 });
    } else if (targetDepth === 1) {
      router.updateSearchParams({ category1: current1, category2: null, page: 1 });
    }
  };

  // 상품 목록과 총 개수를 다시 로드하는 범용 함수
  const loadProductsData = async () => {
    try {
      const params = router.getSearchParams();
      const { category1, category2, search, sort, limit, page } = params;

      const productsResponse = await getProducts({
        category1,
        category2,
        search,
        sort,
        limit: parseInt(limit) || 20,
        page: parseInt(page) || 1,
      });

      updateProductsUI({
        products: productsResponse.products,
      });
      updateTotalProductsCountUI({ count: productsResponse.pagination.total });
    } catch (error) {
      console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  // 카테고리 파라미터 변경 시 필터 섹션만 업데이트
  const updateFilterOnCategoryChange = () => {
    if (Object.keys(currentCategories).length > 0) {
      updateFilterSectionUI({ categories: currentCategories });
    }
  };

  // 초기 데이터 로드
  const loadInitialData = async () => {
    try {
      const params = router.getSearchParams();
      const { category1, category2, search, sort, limit, page } = params;

      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts({
          category1,
          category2,
          search,
          sort,
          limit: parseInt(limit) || 20,
          page: parseInt(page) || 1,
        }),
        getCategories(),
      ]);

      currentCategories = categoriesResponse;

      updateFilterSectionUI({ categories: categoriesResponse });
      updateProductsUI({
        products: productsResponse.products,
      });
      updateTotalProductsCountUI({ count: productsResponse.pagination.total });
    } catch (error) {
      console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  // 각 파라미터 변경 구독
  const unsubscribeCategory1 = router.subscribeSearchParams("category1", async () => {
    loadProductsData();
    updateFilterOnCategoryChange();
  });

  const unsubscribeCategory2 = router.subscribeSearchParams("category2", () => {
    loadProductsData();
    updateFilterOnCategoryChange();
  });

  const unsubscribeSearch = router.subscribeSearchParams("search", () => {
    loadProductsData();
  });

  const unsubscribeSort = router.subscribeSearchParams("sort", () => {
    loadProductsData();
  });

  const unsubscribeLimit = router.subscribeSearchParams("limit", () => {
    loadProductsData();
  });

  const unsubscribePage = router.subscribeSearchParams("page", () => {
    loadProductsData();
  });

  unsubscribeFunctions.push(
    unsubscribeCategory1,
    unsubscribeCategory2,
    unsubscribeSearch,
    unsubscribeSort,
    unsubscribeLimit,
    unsubscribePage,
  );

  // 초기 데이터 로드
  loadInitialData();

  // 페이지 언마운트 시 구독 해제 (필요한 경우)
  const cleanup = () => {
    unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());

    // 각 컴포넌트의 cleanup 함수들도 호출
    if (window.searchBarCleanup) {
      window.searchBarCleanup.forEach((cleanup) => cleanup());
      window.searchBarCleanup = [];
    }
    if (window.sortSelectCleanup) {
      window.sortSelectCleanup.forEach((cleanup) => cleanup());
      window.sortSelectCleanup = [];
    }
    if (window.limitSelectCleanup) {
      window.limitSelectCleanup.forEach((cleanup) => cleanup());
      window.limitSelectCleanup = [];
    }
  };

  // cleanup 함수를 전역에 저장하여 필요시 호출 가능하도록 설정
  window.cleanupProducts = cleanup;

  return Layout({
    children: `<div id="filter-section-container">${FilterSection({ loading: true, categories: [] })}</div>
    <div class="mb-6">
      <div id="products-container">
        <div id="total-products-count" class="mb-4 text-sm text-gray-600"></div>
        ${ProductList({ loading: true })}
        <div class="text-center py-4 text-sm text-gray-500">
          모든 상품을 확인했습니다
        </div>
      </div>
    </div>`,
  });
}

export default Products;
