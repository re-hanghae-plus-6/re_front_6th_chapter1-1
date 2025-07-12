import { getCategories, getProducts } from "../api/productApi";
import Breadcrumb from "../components/Breadcrumb";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductList from "../components/ProductList";
import Search from "../components/Search";
import { render, store, getAppPath } from "../main";

const state = {
  isLoading: true,
  isLoadingMore: false,
  products: [],
  pagination: {},
  categories: {},
  watchRegistered: false,
};

const fetchProducts = async (params = {}) => {
  if (params.page && params.page > 1 && state.pagination && state.pagination.hasNext) {
    state.isLoadingMore = true;
    renderHome();
  } else {
    state.isLoading = true;
  }

  const productData = await getProducts(params);

  // 무한 스크롤 방식 구현으로 누적된 product 값
  if (params.page && params.page > 1) {
    state.products = [...state.products, ...productData.products];
    // 로딩을 조금 늦게 false로 설정
    setTimeout(() => {
      state.isLoadingMore = false;
    }, 500);
  } else {
    state.products = productData.products;
    state.isLoading = false;
  }

  state.pagination = productData.pagination;
};

const fetchCategories = async () => {
  const categoriesData = await getCategories();
  state.categories = categoriesData;
  state.isLoading = false;
};

let scrollHandler = null;
let scrollTimeout = null;

const fetchMoreProductsScroll = () => {
  const location = getAppPath();
  if (location !== "/") return;
  const triggerHeight = 100;

  const handleScroll = () => {
    const location = getAppPath();
    // 메인페이지에서만 가능하도록 처리
    if (location !== "/") return;
    // 로딩 중이거나 다음 페이지가 없으면 스크롤 감지 안함
    if (state.isLoadingMore || state.isLoading || !state.pagination?.hasNext) return;

    const currentScroll = window.scrollY;
    const viewHeight = document.documentElement.clientHeight;
    const bodyHeight = document.body.scrollHeight;

    if (currentScroll + viewHeight > bodyHeight - triggerHeight) {
      if (state.isLoadingMore) return;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        if (state.isLoadingMore || state.isLoading) return;

        state.isLoadingMore = true;
        const currentPage = store.get("params")["page"] || 1;
        store.set("params", {
          ...store.get("params"),
          page: currentPage + 1,
        });
      }, 300);
    }
  };

  // 기존 스크롤 핸들러 제거
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }

  scrollHandler = handleScroll;
  window.addEventListener("scroll", scrollHandler);

  return scrollHandler;
};

const renderHome = () => {
  render.draw(
    "main",
    Home({
      products: state.products,
      pagination: state.pagination,
      isLoading: state.isLoading,
      isLoadingMore: state.isLoadingMore,
      categories: state.categories,
    }),
  );
};

Home.init = () => {
  state.isLoading = true;
  state.watchRegistered = false;
};

Home.mount = async () => {
  const params = new URLSearchParams(window.location.search);
  const paramObj = {};
  for (const [key, value] of params.entries()) {
    paramObj[key] = value;
  }

  await fetchProducts(paramObj);
  await fetchCategories();
  renderHome();

  // fetchMoreProducts(io);
  Search.mount();
  ProductCard.mount();
  store.set("categories", state.categories);
  ProductList.mount(state.products);

  fetchMoreProductsScroll();

  // store.watch 중복 등록 방지
  if (!state.watchRegistered) {
    state.watchRegistered = true;
    store.watch(async (newValue) => {
      console.log("test");
      // 무한 스크롤로 인한 page 변경은 별도 처리
      if (state.isLoadingMore && newValue.page) {
        await fetchProducts(newValue);
        state.isLoadingMore = false;

        render.draw(
          "#product-list",
          ProductList({
            products: state.products,
            pagination: state.pagination,
          }),
        );
        ProductList.mount(state.products);
        ProductCard.mount();
        return;
      }

      const url = new URL(window.location);
      Object.entries(newValue).forEach(([key, value]) => {
        if (value !== "" && value) {
          url.searchParams.set(key, value);
        } else {
          url.searchParams.delete(key);
        }
      });
      window.history.pushState({}, "", url.toString());

      await fetchProducts(newValue);
      state.isLoadingMore = false;

      render.draw("#search-container", Search(store.get("categories"), false));
      Search.mount();

      render.draw("#breadcrumb-container", Breadcrumb());
      Breadcrumb.mount();

      render.draw(
        "#product-list",
        ProductList({
          products: state.products,
          pagination: state.pagination,
        }),
      );

      ProductList.mount(state.products);

      ProductCard.mount();
    }, "params");
  }
};

Home.unmount = () => {
  // 스크롤 이벤트 리스너 정리
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }

  // 타이머 정리
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }
};

export default function Home({ products, pagination, isLoading, categories, isLoadingMore }) {
  return /* html */ `
  <div id="search-container">
    ${Search(categories, isLoading)}
    </div>
    <!-- 상품 목록 -->
    <div class="mb-6 min-h-dvh">
      <div >
        <!-- 상품 그리드 -->
        ${state.isLoading ? Loading({ type: "products" }) : ProductList({ products, pagination })}
        ${
          isLoadingMore
            ? Loading({ type: "products" })
            : /* html */ `
              <div class="text-center py-4 text-sm text-gray-500">
                모든 상품을 확인했습니다
              </div>`
        }
        </div>
        <div id="scroll-trigger"  class="h-4"></div>
        </div>
        `;
}
