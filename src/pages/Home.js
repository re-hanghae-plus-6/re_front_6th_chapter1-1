import { getCategories, getProducts } from "../api/productApi";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductList from "../components/ProductList";
import Search from "../components/Search";
import { render, store } from "../main";

const state = {
  isLoading: true,
  isLoadingMore: false,
  products: [],
  pagination: {},
  categories: {},
};

const fetchProducts = async (params = {}) => {
  if (params.page && params.page > 1 && state.pagination && state.pagination.hasNext) {
    state.isLoadingMore = true;
    renderHome();
  } else {
    state.isLoading = true;
  }

  const productData = await getProducts(params);
  state.isLoading = false;

  // 무한 스크롤 방식 구현으로 누적된 product 값
  if (params.page && params.page > 1) {
    state.products = [...state.products, ...productData.products];
    state.isLoadingMore = false;
  } else {
    state.products = productData.products;
  }

  state.pagination = productData.pagination;
};

const fetchCategories = async () => {
  const categoriesData = await getCategories();
  state.categories = categoriesData;
  state.isLoading = false;
};

const fetchMoreProducts = (io = null) => {
  if (typeof IntersectionObserver === "undefined") return;
  const trigger = document.querySelector("#scroll-trigger");
  if (!trigger) return;
  if (io) io.disconnect();

  io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        if (state.pagination && state.pagination.hasNext) {
          const currentPage = store.get("params")["page"];
          store.set("params.page", currentPage + 1);
        }
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    },
  );

  io.observe(trigger);
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
};

Home.mount = async () => {
  let io;

  await fetchProducts();
  await fetchCategories();
  renderHome();
  fetchMoreProducts(io);
  Search.mount();
  ProductCard.mount();

  store.watch(async (newValue) => {
    const url = new URL(window.location);
    Object.entries(newValue).forEach(([key, value]) => {
      if (value !== "" && value) {
        url.searchParams.set(key, value);
      }
    });
    window.history.pushState({}, "", url.toString());

    await fetchProducts(newValue);
    await fetchCategories();
    renderHome();
    fetchMoreProducts(io);
    Search.mount();
    ProductCard.mount();
  }, "params");
};

export default function Home({ products, pagination, isLoading, categories, isLoadingMore }) {
  return /* html */ `
    ${Search(categories, isLoading)}
    <!-- 상품 목록 -->
    <div class="mb-6 min-h-dvh">
      <div>
        <!-- 상품 그리드 -->
        ${state.isLoading ? Loading({ type: "products" }) : ProductList(products, pagination)}
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
