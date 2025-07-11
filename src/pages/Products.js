import { getCategories, getProducts } from "../api/productApi";
import FilterSection from "../components/product/list/FilterSection";
import Layout from "../components/product/list/Layout";
import ProductList from "../components/product/list/ProductList";
import Link from "../components/common/Link";
import ProductCard from "../components/product/list/ProductCard";
import { router } from "../routes";

const infiniteScrollState = {
  currentPage: 1,
  isLoading: false,
  hasMoreData: true,

  reset() {
    this.currentPage = 1;
    this.isLoading = false;
    this.hasMoreData = true;
  },

  incrementPage() {
    this.currentPage += 1;
  },

  setLoading(loading) {
    this.isLoading = loading;
  },

  setNoMoreData() {
    this.hasMoreData = false;
  },

  canLoadMore() {
    return !this.isLoading && this.hasMoreData;
  },
};

function Products() {
  let currentCategories = {};
  const unsubscribeFunctions = [];

  const updateProductsUI = ({ products, isAppend = false }) => {
    const productListElement = document.getElementById("products-grid");
    if (!productListElement) return;

    if (isAppend) {
      const loadingIndicator = document.getElementById("loading-indicator");
      if (loadingIndicator) {
        loadingIndicator.remove();
      }

      products.forEach((product) => {
        const listItem = document.createElement("li");

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = ProductCard({ product });
        const productCardElement = tempDiv.firstElementChild;

        const linkElement = Link({
          to: `/product/${product.productId}`,
          children: productCardElement,
        });

        listItem.appendChild(linkElement);
        productListElement.appendChild(listItem);
      });
    } else {
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

    setupCategoryEventListeners();
  };

  const showLoadingIndicator = () => {
    const container = document.getElementById("products-container");
    if (!container.querySelector("#loading-indicator")) {
      const loadingDiv = document.createElement("div");
      loadingDiv.id = "loading-indicator";
      loadingDiv.className = "text-center py-4 text-sm text-gray-500";
      loadingDiv.textContent = "상품을 불러오는 중...";
      container.appendChild(loadingDiv);
    }
  };

  const hideLoadingIndicator = () => {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  };

  const showNoMoreDataMessage = () => {
    const container = document.getElementById("products-container");
    if (!container.querySelector("#no-more-data")) {
      const existingMessage = container.querySelector(".text-center.py-4.text-sm.text-gray-500");
      if (existingMessage) {
        existingMessage.remove();
      }

      const noMoreDataDiv = document.createElement("div");
      noMoreDataDiv.id = "no-more-data";
      noMoreDataDiv.className = "text-center py-4 text-sm text-gray-500";
      noMoreDataDiv.textContent = "모든 상품을 확인했습니다";
      container.appendChild(noMoreDataDiv);
    }
  };

  const loadProductsData = async () => {
    try {
      const params = router.getSearchParams();
      const { category1, category2, search, sort, limit } = params;

      const productsResponse = await getProducts({
        category1,
        category2,
        search,
        sort,
        limit: Number.parseInt(limit) || 20,
        page: 1,
      });

      updateProductsUI({
        products: productsResponse.products,
        isAppend: false,
      });
      updateTotalProductsCountUI({ count: productsResponse.pagination.total });
    } catch (error) {
      console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  const loadMoreProducts = async () => {
    if (!infiniteScrollState.canLoadMore()) return;

    infiniteScrollState.setLoading(true);
    showLoadingIndicator();

    try {
      const params = router.getSearchParams();
      const { category1, category2, search, sort, limit } = params;

      const nextPage = infiniteScrollState.currentPage + 1;
      const productsResponse = await getProducts({
        category1,
        category2,
        search,
        sort,
        limit: Number.parseInt(limit) || 20,
        page: nextPage,
      });

      if (productsResponse.products.length === 0) {
        infiniteScrollState.setNoMoreData();
        showNoMoreDataMessage();
      } else {
        infiniteScrollState.incrementPage();
        updateProductsUI({ products: productsResponse.products, isAppend: true });
      }
    } catch (error) {
      console.error("추가 상품 로드 중 오류:", error);
    } finally {
      infiniteScrollState.setLoading(false);
      hideLoadingIndicator();
    }
  };

  const setupInfiniteScroll = () => {
    const handleScroll = async () => {
      if (!infiniteScrollState.canLoadMore()) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= documentHeight - 100) {
        await loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    const unsubscribeScroll = () => {
      window.removeEventListener("scroll", handleScroll);
    };

    unsubscribeFunctions.push(unsubscribeScroll);
  };

  const setupCategoryEventListeners = () => {
    const filterSectionContainer = document.getElementById("filter-section-container");
    if (!filterSectionContainer) return;

    filterSectionContainer.addEventListener("click", (event) => {
      const target = event.target;

      if (target.hasAttribute("data-category1") && !target.hasAttribute("data-category2")) {
        const category1 = target.getAttribute("data-category1");
        handleCategorySelect(category1, null);
      }

      if (target.hasAttribute("data-category1") && target.hasAttribute("data-category2")) {
        const category1 = target.getAttribute("data-category1");
        const category2 = target.getAttribute("data-category2");
        handleCategorySelect(category1, category2);
      }

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
      page: 1,
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

  const updateFilterOnCategoryChange = () => {
    if (Object.keys(currentCategories).length > 0) {
      updateFilterSectionUI({ categories: currentCategories });
    }
  };

  const loadInitialData = async () => {
    try {
      const params = router.getSearchParams();
      const { category1, category2, search, sort, limit } = params;

      const categoriesResponse = await getCategories();
      const productsResponse = await getProducts({
        category1,
        category2,
        search,
        sort,
        limit: parseInt(limit) || 20,
        page: 1,
      });

      currentCategories = categoriesResponse;

      updateFilterSectionUI({ categories: categoriesResponse });
      updateProductsUI({
        products: productsResponse.products,
        isAppend: false,
      });
      updateTotalProductsCountUI({ count: productsResponse.pagination.total });

      setupInfiniteScroll();
    } catch (error) {
      console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  const searchParamHandlers = {
    category1: () => {
      infiniteScrollState.reset();
      loadProductsData();
      updateFilterOnCategoryChange();
    },
    category2: () => {
      infiniteScrollState.reset();
      loadProductsData();
      updateFilterOnCategoryChange();
    },
    search: () => {
      infiniteScrollState.reset();
      loadProductsData();
    },
    sort: () => {
      infiniteScrollState.reset();
      loadProductsData();
    },
    limit: () => {
      infiniteScrollState.reset();
      loadProductsData();
    },
    page: () => {
      loadProductsData();
    },
  };

  Object.keys(searchParamHandlers).forEach((param) => {
    const unsubscribe = router.subscribeSearchParams(param, searchParamHandlers[param]);
    unsubscribeFunctions.push(unsubscribe);
  });

  loadInitialData();

  const cleanup = () => {
    unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());

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

  window.cleanupProducts = cleanup;

  const handleBeforeUnload = () => {
    cleanup();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  unsubscribeFunctions.push(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  return Layout({
    children: `<div id="filter-section-container">${FilterSection({ loading: true, categories: [] })}</div>
    <div class="mb-6">
      <div id="products-container">
        <div id="total-products-count" class="mb-4 text-sm text-gray-600"></div>
        ${ProductList({ loading: true })}
      </div>
    </div>`,
  });
}

export default Products;
