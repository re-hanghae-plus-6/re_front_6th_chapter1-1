/* eslint-disable no-unused-vars */
import { getProducts, getCategories } from "../api/productApi.js";
import { ProductListUI } from "../views/ProductListUI.js";
import { showToast } from "../components/Toast.js";

export const ProductListPage = ({ state, openCartModal, addToCart, setState, navigateTo }) => {
  const pageInstance = {};
  const createPage = async () => {
    setupScrollInfinity();
    const categoriesRes = await getCategories();
    setState({ categories: categoriesRes });
    await fetchProducts();
    setState({ loading: false });
  };
  const render = () => {
    const root = document.getElementById("root");
    root.innerHTML = ProductListUI(state);
    bindProductListEvents();
  };

  const fetchProducts = async (params = {}) => {
    // 기존 state.filters와 params를 합쳐서 요청
    const query = {
      ...state.filters,
      ...params,
      page: params.page || state.pagination.page,
      limit: params.limit || state.pagination.limit,
    };
    const productRes = await getProducts(query);
    setState({ products: productRes.products, filters: productRes.filters, pagination: productRes.pagination });
  };
  const setupScrollInfinity = () => {
    window.removeEventListener("scroll", handleScrollInfinity);
    window.addEventListener("scroll", handleScrollInfinity);
  };
  const cleanupScrollInfinity = () => {
    window.removeEventListener("scroll", handleScrollInfinity);
  };
  const handleScrollInfinity = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && state.pagination.hasNext && !state.productInfiniteLoading) {
      setState({ productInfiniteLoading: true });
      fetchInfiniteProducts({ page: state.pagination.page + 1, limit: state.pagination.limit });
    }
  };

  const fetchInfiniteProducts = async (params = {}) => {
    render(ProductListPage(state));
    const query = {
      ...state.filters,
      ...params,
      page: params.page || state.pagination.page,
    };
    const productRes = await getProducts(query);
    setState({ products: [...state.products, ...productRes.products], pagination: productRes.pagination });
    setState({ productInfiniteLoading: false });
    // render();
  };

  const onProductClick = (productId) => {
    navigateTo(`/product/${productId}`);
  };

  //페이지당 상품수 변경
  const onLimitChange = (limit) => {
    fetchProducts({ limit, page: 1 });

    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        limit,
        sort: state.filters.sort,
        search: state.filters.search,
        category1: state.filters.category1,
        category2: state.filters.category2,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  // 검색
  const onSearch = (searchText) => {
    fetchProducts({ search: searchText, page: 1 });
    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        search: searchText,
        sort: state.filters.sort,
        limit: state.filters.limit,
        category1: state.filters.category1,
        category2: state.filters.category2,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  // 정렬 변경
  const onSortChange = (sortType) => {
    fetchProducts({ sort: sortType, page: 1 });
    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        sort: sortType,
        search: state.filters.search,
        limit: state.filters.limit,
        category1: state.filters.category1,
        category2: state.filters.category2,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  // 카테고리 변경
  const onCategoryChange = (category) => {
    fetchProducts({ category1: category, page: 1 });
    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        category1: category,
        sort: state.filters.sort,
        search: state.filters.search,
        limit: state.filters.limit,
        category2: state.filters.category2,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  // 카테고리2 변경
  const onCategory2Change = (category) => {
    fetchProducts({ category2: category, page: 1 });
    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        category2: category,
        sort: state.filters.sort,
        search: state.filters.search,
        limit: state.filters.limit,
        category1: state.filters.category1,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  // 모든 카테고리 초기화
  const onCategoryReset = () => {
    fetchProducts({ category1: "", category2: "", page: 1 });
    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        category1: "",
        category2: "",
        sort: state.filters.sort,
        search: state.filters.search,
        limit: state.filters.limit,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  // category2만 초기화
  const onCategory2Reset = () => {
    fetchProducts({ category2: "", page: 1 });
    const params = new URLSearchParams(
      Object.entries({
        ...state.filters,
        category2: "",
        sort: state.filters.sort,
        search: state.filters.search,
        limit: state.filters.limit,
        category1: state.filters.category1,
      }).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
    );
    navigateTo(`/?${params.toString()}`);
  };

  const bindProductListEvents = () => {
    // 검색
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = state.filters.search || "";
      searchInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          onSearch(e.target.value);
        }
      };
    }
    // 개수 변경
    const limitSelect = document.getElementById("limit-select");
    if (limitSelect) {
      limitSelect.value = state.pagination.limit || 20;
      limitSelect.onchange = (e) => {
        setState({ pagination: { ...state.pagination, limit: Number(e.target.value) } });
        onLimitChange(Number(e.target.value));
      };
    }

    // 정렬 변경
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.value = state.filters.sort || "price_asc";
      sortSelect.onchange = (e) => {
        setState({ filters: { ...state.filters, sort: e.target.value } });
        onSortChange(e.target.value);
      };
    }

    // 카테고리 필터 버튼
    const categoryButtons = document.querySelectorAll(".category1-filter-btn");
    categoryButtons.forEach((button) => {
      button.onclick = (e) => {
        const category = e.target.getAttribute("data-category1");
        onCategoryChange(category);
      };
    });

    // 카테고리 2depth 필터 버튼
    const category2Buttons = document.querySelectorAll(".category2-filter-btn");
    category2Buttons.forEach((button) => {
      button.onclick = (e) => {
        const category = e.target.getAttribute("data-category2");
        onCategory2Change(category);
      };
    });

    // 브레드크럼 버튼들
    const breadcrumbButtons = document.querySelectorAll("[data-breadcrumb]");
    breadcrumbButtons.forEach((button) => {
      button.onclick = (e) => {
        const breadcrumbType = e.target.getAttribute("data-breadcrumb");
        if (breadcrumbType === "reset") {
          // 모든 카테고리 초기화
          setState({ filters: { ...state.filters, category1: "", category2: "" } });
          onCategoryReset();
        } else if (breadcrumbType === "category1") {
          // category2만 초기화
          setState({ filters: { ...state.filters, category2: "" } });
          onCategory2Reset();
        }
      };
    });

    // 장바구니 아이콘 버튼
    const cartIconBtn = document.getElementById("cart-icon-btn");
    if (cartIconBtn) {
      cartIconBtn.onclick = () => {
        openCartModal();
      };
    }

    // 장바구니 담기 버튼들
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((button) => {
      button.onclick = (e) => {
        e.stopPropagation();
        const productId = e.target.getAttribute("data-product-id");
        const product = state.products.find((p) => p.productId === productId);
        if (product) {
          addToCart({ product });
          showToast("장바구니에 추가되었습니다");
        }
      };
    });

    // 상품 클릭 이벤트
    const productItems = document.querySelectorAll(".product-card");
    productItems.forEach((item) => {
      item.onclick = (e) => {
        const productId = e.target.closest(".product-card").getAttribute("data-product-id");
        onProductClick(productId);
      };
    });
  };

  // pageInstance에 메서드 할당
  pageInstance.createPage = createPage;
  pageInstance.render = render;
  pageInstance.cleanupScrollInfinity = cleanupScrollInfinity;

  return pageInstance;
};

export default ProductListPage;
