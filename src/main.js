import { Header } from "./components/productList/layout/header.js";
import { Category } from "./components/productList/category/category.js";
import { ProductGrid } from "./components/productList/layout/productGrid.js";
import { SkeletonProduct } from "./components/productList/skeleton/skeletonProduct.js";
import { ListLoadingIndicator } from "./components/productList/layout/listLoadingIndicator.js";
import { Footer } from "./components/productList/layout/footer.js";
import { Product } from "./components/productList/product/product.js";
import { ListEndIndicator } from "./components/productList/layout/listEndindicator.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

const store = {
  state: {
    products: [],
    filters: {},
    pagination: {},
    categoryLoading: false,
    productLoading: false,
    categories: {},
  },
  observers: [],
  subscribe: (observer) => {
    store.observers.push(observer);
  },
  unsubscribe: (observer) => {
    store.observers = store.observers.filter((o) => o !== observer);
  },
  notify: () => {
    store.observers.forEach((observer) => observer.update());
  },
};

async function getCategories({ state }) {
  state.categoryLoading = true;
  store.notify();
  const response = await fetch("/api/categories");
  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 1_000));
  state.categoryLoading = false;
  store.notify();
  return data;
}

async function getProducts({ state }) {
  state.productLoading = true;
  store.notify();
  const response = await fetch("/api/products");
  const data = await response.json();
  console.log("data", data);
  await new Promise((resolve) => setTimeout(resolve, 1_000));
  state.productLoading = false;
  store.notify();
  return data;
}

function render({ state }) {
  console.log("state.loading", state.categoryLoading);
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title: "쇼핑몰", cartItemCount: 0 })}
      <main class="max-w-md mx-auto px-4 py-4">
      ${Category({ state: state || {} })}
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
          </div>
          ${state.productLoading ? ListLoadingIndicator : ListEndIndicator}
        </div>
      </main>
      ${Footer}
</div>
  `;
}
function main() {
  store.subscribe({
    update: () => {
      render({ state: store.state });
    },
  });

  getCategories({ state: store.state, render })
    .then((data) => {
      console.log("data", data);
      store.state.categories = data;
      store.notify();
    })
    .catch((error) => {
      console.error("error", error);
    });

  getProducts({ state: store.state, render })
    .then((data) => {
      console.log("data", data);
      const { products, filters, pagination } = data;
      store.state.products = products;
      store.state.filters = filters;
      store.state.pagination = pagination;
      store.notify();
    })
    .catch((error) => {
      console.error("error", error);
    });

  store.notify();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
