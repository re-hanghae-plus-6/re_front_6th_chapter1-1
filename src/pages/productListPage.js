import { Header } from "../components/productList/layout/header.js";
import { Category } from "../components/productList/category/category.js";
import { Product } from "../components/productList/product/product.js";
import { ListLoadingIndicator } from "../components/productList/layout/listLoadingIndicator.js";
import { ListEndIndicator } from "../components/productList/layout/listEndindicator.js";
import { Footer } from "../components/productList/layout/footer.js";
import { SkeletonProduct } from "../components/productList/skeleton/skeletonProduct.js";
import { ProductGrid } from "../components/productList/layout/productGrid.js";
import { router } from "../router.js";
import { getCategories, getProducts } from "../api/productApi.js";
import { render } from "../render.js";
import { store } from "../store.js";
import { queryStringToObject, objectToQueryString } from "../utils.js";

const state = {
  products: [],
  filters: {},
  pagination: {},
  categoryLoading: false,
  productLoading: false,
  categories: {},
  productCountLimit: 20,
  isEnd: false,
};

export const ProductListPage = () => {
  const { productCountLimit, pagination } = state;
  const limit = Number(new URL(window.location.href).searchParams.get("limit") || productCountLimit);
  const sort = new URL(window.location.href).searchParams.get("sort") || "price_asc";
  const search = new URL(window.location.href).searchParams.get("search") || "";
  const page = pagination.page;
  const [mounted, setMounted] = store.useState("mounted");

  if (mounted === false) {
    state.productLoading = true;
    state.categoryLoading = true;

    Promise.all([
      getProducts({ limit, sort, page, search }).then((data) => {
        state.productLoading = false;
        state.products = data.products;
        state.pagination = data.pagination;
        state.filters = data.filters;
        state.isEnd = data.pagination.total <= state.products.length;
      }),
      getCategories().then((data) => {
        state.categoryLoading = false;
        state.categories = data;
      }),
    ]).then(() => {
      setMounted(true);
      render();
    });
  }

  return `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title: "쇼핑몰", cartItemCount: 0 })}
      <main class="max-w-md mx-auto px-4 py-4">
      ${Category({ state })}
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
          <!-- 상품 개수 정보 -->
          ${
            state.productLoading
              ? ""
              : `<div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${state.pagination.total}개</span>의 상품
            </div>`
          }
            <!-- 상품 그리드 -->
            ${ProductGrid({
              children: `
              ${
                (state.products ?? []).length > 0
                  ? `${state.products.map((product) => Product(product)).join("")}`
                  : `
                    ${SkeletonProduct}
                    ${SkeletonProduct}
                    ${SkeletonProduct}
                    ${SkeletonProduct}
                    `
              }
              `,
            })}
            <div id="product-list-end-indicator" style="height: 100px;">
              ${state.isEnd ? ListEndIndicator : ListLoadingIndicator}
            </div>
          </div>
        </div>
      </main>
      ${Footer}
</div>
  `;
};

ProductListPage.state = state;

ProductListPage.registerEvent = () => {
  const limitSelect = document.getElementById("limit-select");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");

  limitSelect.addEventListener("change", (event) => {
    const url = new URL(window.location.href);
    const queryString = objectToQueryString({
      ...queryStringToObject(url.search),
      limit: event.target.value,
    });

    router.push(`${url.pathname}?${queryString}`);
  });

  sortSelect.addEventListener("change", (event) => {
    const url = new URL(window.location.href);
    const queryString = objectToQueryString({
      ...queryStringToObject(url.search),
      sort: event.target.value,
    });

    router.push(`${url.pathname}?${queryString}`);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const url = new URL(window.location.href);
    const queryString = objectToQueryString({
      ...queryStringToObject(url.search),
      search: event.target.value,
    });

    router.push(`${url.pathname}?${queryString}`);
  });

  const productListEndIndicator = document.getElementById("product-list-end-indicator");
  let moreLoading = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !moreLoading) {
          moreLoading = true;
          console.log("end");
          state.pagination.page++;
          io.unobserve(productListEndIndicator);

          const limit = state.pagination.limit;
          const sort = state.filters.sort;
          const page = state.pagination.page;
          const search = state.filters.search;

          getProducts({ limit, sort, page, search })
            .then((data) => {
              state.productLoading = false;
              state.products = [...state.products, ...data.products];
              state.pagination = data.pagination;
              state.filters = data.filters;
              state.isEnd = data.pagination.total <= state.products.length;
            })
            .then(() => {
              moreLoading = false;
              render();
            });
        }
      });
    },
    { threshold: 0.7 },
  );

  io.observe(productListEndIndicator);
};
