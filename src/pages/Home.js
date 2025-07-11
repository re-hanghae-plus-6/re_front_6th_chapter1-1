import ProductCard from "../components/product/ProductCard";
import ProductSkeleton, { ProductLoadingIndicator } from "../components/product/ProductSkeleton";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getProducts, getCategories } from "../api/productApi.js";
import { productStore } from "../store/productStore.js";
import { cartStore } from "../store/cartStore.js";
import ProductFilter from "../components/product/ProductFilter.js";
import { registerHomeEventListeners } from "../utils/eventHandlers.js";
import { CartIcon } from "../components/common/Header.js";

// 상품 목록
function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  const totalCountContainer = document.getElementById("total-count-container");
  const endMessageContainer = document.getElementById("end-message");
  const state = productStore.getState();

  if (!productsGrid) return;

  if (state.loading && state.hasMore) {
    productsGrid.innerHTML = `${Array(6).fill().map(ProductSkeleton).join("")}${ProductLoadingIndicator()}`;
    return;
  }

  productsGrid.innerHTML = state.products.map(ProductCard).join("");
  if (totalCountContainer) {
    if (state.products && state.products.length > 0) {
      totalCountContainer.style.display = "block";
      totalCountContainer.innerHTML = `총 <span id="total-count" class="font-medium text-gray-900">${state.totalCount}개</span>의 상품`;
    } else {
      totalCountContainer.style.display = "none";
      totalCountContainer.textContent = "";
    }
  }

  if (endMessageContainer) {
    if (!state.hasMore && state.products && state.products.length > 0) {
      endMessageContainer.style.display = "block";
    } else {
      endMessageContainer.style.display = "none";
    }
  }
}

async function loadProducts({ append = false }) {
  productStore.setLoading(true);
  productStore.setError(null);
  try {
    const state = productStore.getState();
    const response = await getProducts({
      limit: state.limit,
      sort: state.sort,
      search: state.search,
      page: state.page,
      category1: state.category1,
      category2: state.category2,
    });

    if (response.products) {
      productStore.setProducts(response.products, append);
      productStore.setTotalCount(response.pagination?.total ?? response.products.length);

      // 무한스크롤
      const total = response.pagination?.total ?? 0;
      const currentProductsLength = append
        ? state.products.length + response.products.length
        : response.products.length;
      const hasMore = currentProductsLength < total;
      productStore.setHasMore(hasMore);

      if (hasMore) {
        productStore.setPage(state.page + 1);
      }
    } else {
      productStore.setError("상품 목록을 불러오는데 실패했습니다.");
    }
  } catch (error) {
    productStore.setError("상품 목록을 불러오는데 실패했습니다.");
    console.error("상품 목록 로드 에러:", error);
  } finally {
    productStore.setLoading(false);
  }
}

function renderFilter() {
  const filterContainer = document.querySelector("main");
  if (!filterContainer) return;
  const oldFilter = filterContainer.querySelector("#product-filter");
  if (oldFilter) oldFilter.remove();
  const filterHTML = ProductFilter({ state: productStore.getState() });
  filterContainer.insertAdjacentHTML("afterbegin", filterHTML);
}

// 장바구니 카운트 업데이트
function updateCartCount() {
  const cartState = cartStore.getState();
  const cartIconContainer = document.getElementById("cart-icon-container");

  if (cartIconContainer) {
    cartIconContainer.innerHTML = CartIcon(cartState.totalCount);
  }
}

export default function Home() {
  const template = `
    ${Header()}
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          <div id="total-count-container" class="mb-4 text-sm text-gray-600"></div>
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"></div>
          <!-- 무한 스크롤 타겟 -->
          <div id="observer-target"></div>
          <div id="end-message" class="text-center py-4 text-sm text-gray-500">
            모든 상품을 확인했습니다
          </div>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  async function mount() {
    // window.scrollTo(0, 0);

    updateCartCount();
    renderFilter();
    renderProducts();

    const categories = await getCategories();
    productStore.setCategories(categories);

    // 이벤트 리스너 등록
    registerHomeEventListeners(loadProducts);

    await loadProducts({ append: false });

    // 무한 스크롤 처리
    const observerTarget = document.getElementById("observer-target");
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        const state = productStore.getState();
        if (entry.isIntersecting && !state.loading && state.hasMore) {
          await loadProducts({ append: true });
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    // 상품 스토어 구독
    const unsubscribe = productStore.subscribe(() => {
      renderProducts();
      renderFilter();
    });

    // 장바구니 스토어 구독
    const cartUnsubscribe = cartStore.subscribe(() => {
      updateCartCount();
    });

    return () => {
      observer.disconnect();
      unsubscribe();
      cartUnsubscribe();
    };
  }

  return { template, mount };
}
