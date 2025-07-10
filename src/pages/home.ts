import { 상품목록_레이아웃 } from "../components/product-list/index.ts";
import { getProducts, getCategories } from "../api/productApi.js";
import type { Categories } from "../components/category/index.ts";
import type { PageModule } from "../router.ts";
import { navigate } from "../router.ts";
import { 토스트 } from "../components/toast/index.ts";
import { addToCart, getCartCount } from "../utils/cart.ts";
import { 장바구니 } from "../components/cart/index.ts";

interface Product {
  title: string;
  lprice: string;
  image: string;
  productId: string;
}

interface State {
  products: Product[];
  total: number;
  loading: boolean;
  error: boolean;
  limit: number;
  sort: string;
  page: number;
  isLoadingNextPage: boolean;
  search: string;
  category1: string | null;
  category2: string | null;
  categories: Categories | null;
}

export const homePage: PageModule = {
  render: function () {
    // 초기에는 loading 상태로 통합 레이아웃을 보여줌
    return 상품목록_레이아웃({ loading: true });
  },

  mount: function (root) {
    if (!root) return;

    // 컴포넌트 상태
    let state: State = {
      products: [],
      total: 0,
      loading: true,
      error: false,
      limit: 20,
      sort: "price_asc",
      page: 1,
      isLoadingNextPage: false,
      search: "",
      category1: null,
      category2: null,
      categories: null,
    };

    const setState = (newState: Partial<State>) => {
      state = { ...state, ...newState };
      rerender();
    };

    const rerender = () => {
      const cartCount = getCartCount();
      root.innerHTML = 상품목록_레이아웃({
        loading: state.loading,
        error: state.error,
        total: state.total,
        products: state.products.map((product) => ({
          id: product.productId,
          title: product.title,
          price: Number(product.lprice),
          imageUrl: product.image,
        })),
        cartCount,
        isLoadingNextPage: state.isLoadingNextPage,
        categories: state.categories ?? undefined,
        category1: state.category1,
        category2: state.category2,
      });

      // 로딩 ui 노출 시 이벤트 바인딩이 불필요
      if (!state.loading) bindEvents();
    };

    const updateProducts = async (options = { isAppend: false }) => {
      const { isAppend } = options;
      try {
        const data = await getProducts({
          limit: state.limit,
          page: state.page,
          sort: state.sort,
          search: state.search,
          category1: state.category1 ?? "",
          category2: state.category2 ?? "",
        });

        if (isAppend)
          setState({
            products: [...state.products, ...(data.products as Product[])],
            total: data.pagination.total ?? data.products.length,
            isLoadingNextPage: false,
          });
        else
          setState({
            products: data.products as Product[],
            total: data.pagination.total ?? data.products.length,
            loading: false,
          });
      } catch (err) {
        setState({ loading: false, error: true });
        console.error(err);
      }
    };

    // 이벤트 핸들러들
    const handleLimitChange = (e: Event) => {
      const select = e.target as HTMLSelectElement;
      const newLimit = Number(select.value);
      if (newLimit !== state.limit) {
        setState({ limit: newLimit, page: 1 });
        updateProducts();
      }
    };

    const handleSortChange = (e: Event) => {
      const select = e.target as HTMLSelectElement;
      const newSort = select.value;
      if (newSort !== state.sort) {
        setState({ sort: newSort, page: 1 });
        updateProducts();
      }
    };

    const handleSearchKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const input = e.target as HTMLInputElement;
      const keyword = input.value.trim();
      if (keyword === state.search) return;
      setState({ search: keyword, page: 1 });
      updateProducts();
    };

    const handleCategoryClick = (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.dataset.breadcrumb === "reset") {
        setState({ category1: null, category2: null, page: 1 });
        updateProducts();
        return;
      }

      if (target.dataset.breadcrumb === "category1") {
        const cat1 = target.dataset.category1 ?? "";
        setState({ category1: cat1, category2: null, page: 1 });
        updateProducts();
        return;
      }

      if (target.dataset.category1 && !target.dataset.category2) {
        const cat1 = target.dataset.category1;
        if (cat1 !== state.category1) {
          setState({ category1: cat1, category2: null, page: 1 });
          updateProducts();
        }
        return;
      }

      if (target.dataset.category2) {
        const cat1 = target.dataset.category1 ?? state.category1 ?? "";
        const cat2 = target.dataset.category2;
        setState({ category1: cat1, category2: cat2, page: 1 });
        updateProducts();
      }
    };

    const handleProductClick = (e: Event) => {
      const targetEl = (e.target as HTMLElement).closest(".product-card") as HTMLElement | null;
      if (!targetEl) return;
      const productId = targetEl.dataset.productId;
      if (productId) {
        navigate(`/product/${productId}`);
      }
    };

    const handleAddToCart = (e: Event) => {
      e.stopPropagation();
      const btn = e.currentTarget as HTMLElement;
      const productId = btn.dataset.productId;
      if (!productId) return;

      const productCard = btn.closest(".product-card");
      const quantityInput = productCard?.querySelector(".quantity-input") as HTMLInputElement;
      const quantity = Math.max(1, parseInt(quantityInput?.value || "1", 10));
      const unitPrice = Number(btn.dataset.productPrice ?? "0");
      const title = btn.dataset.productTitle ?? "";
      addToCart(productId, quantity, unitPrice, title);
      토스트("장바구니에 추가되었습니다", "success");
      rerender();
    };

    const handleRetry = () => {
      setState({ error: false, loading: true });
      initData();
    };

    const handleScroll = () => {
      const isLoading = state.isLoadingNextPage || state.loading;
      const hasAllProducts = state.products.length >= state.total;
      const shouldSkipScroll = isLoading || hasAllProducts;

      if (shouldSkipScroll) return;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isBottom) {
        // 다음 페이지 로드
        setState({ isLoadingNextPage: true, page: state.page + 1 });
        updateProducts({ isAppend: true });
      }
    };

    const bindEvents = () => {
      const sortSelectEl = root.querySelector("#sort-select") as HTMLSelectElement | null;
      const limitSelectEl = root.querySelector("#limit-select") as HTMLSelectElement | null;
      const searchInputEl = root.querySelector("#search-input") as HTMLInputElement | null;
      const categoryButtonEls = root.querySelectorAll("[data-category1], [data-breadcrumb]");
      const productClickableEls = root.querySelectorAll(".product-image, .product-info");
      const addToCartBtnEls = root.querySelectorAll(".add-to-cart-btn");
      const cartIconEl = root.querySelector("#cart-icon-btn") as HTMLButtonElement | null;
      const retryButtonEl = root.querySelector("#retry-button") as HTMLButtonElement | null;

      if (limitSelectEl) {
        limitSelectEl.value = String(state.limit);
        limitSelectEl.addEventListener("change", handleLimitChange);
      }

      if (sortSelectEl) {
        sortSelectEl.value = state.sort;
        sortSelectEl.addEventListener("change", handleSortChange);
      }

      if (searchInputEl) {
        searchInputEl.value = state.search;
        searchInputEl.addEventListener("keydown", handleSearchKeydown);
      }

      categoryButtonEls.forEach((buttonEl) => {
        buttonEl.addEventListener("click", handleCategoryClick);
      });

      productClickableEls.forEach((el) => {
        el.addEventListener("click", handleProductClick);
      });

      addToCartBtnEls.forEach((btn) => btn.addEventListener("click", handleAddToCart));

      if (cartIconEl) cartIconEl.addEventListener("click", 장바구니);

      if (retryButtonEl) retryButtonEl.addEventListener("click", handleRetry);
    };

    const initData = async () => {
      try {
        const [categories, data] = await Promise.all([
          getCategories(),
          getProducts({
            limit: state.limit,
            page: state.page,
            sort: state.sort,
            search: state.search,
          }),
        ]);

        setState({
          categories,
          products: data.products as Product[],
          total: data.pagination.total ?? data.products.length,
          loading: false,
          error: false,
        });
      } catch (err) {
        setState({ loading: false, error: true });
        console.error(err);
      }
    };

    initData();

    window.addEventListener("scroll", handleScroll);
    return () => {
      // 언마운트(cleanup)
      window.removeEventListener("scroll", handleScroll);
    };
  },
};
