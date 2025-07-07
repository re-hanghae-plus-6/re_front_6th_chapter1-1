import { getProducts } from "./api/productApi";
import { CartModal } from "./components/CartModal.js";

/** 장바구니 목록 보기 함수 */
function viewCartHandler(state) {
  const cartIcon = document.getElementById("cart-icon-btn");
  if (!cartIcon) return;
  cartIcon.addEventListener("click", () => {
    const modalPortal = document.getElementById("modal-portal");
    if (!modalPortal) return;
    modalPortal.innerHTML = CartModal({ cart: state.cart });
    closeCartModal();
  });
}

// 장바구니 모달 닫기  함수
function closeCartModal() {
  const modalPortal = document.getElementById("modal-portal");
  const cartModalCloseBtn = document.getElementById("cart-modal-close-btn");
  const cartModalBackground = document.getElementById("cart-modal-bg");
  if (cartModalCloseBtn) {
    cartModalCloseBtn.addEventListener("click", () => {
      if (modalPortal) modalPortal.innerHTML = "";
    });
  }
  if (cartModalBackground) {
    cartModalBackground.addEventListener("click", (e) => {
      if (e.target === cartModalBackground && modalPortal) {
        modalPortal.innerHTML = "";
      }
    });
  }
}

/** 장바구니 닫는 함수 */
// function closeCartModal() {
//   const cartModalCloseBtn = document.getElementById("cart-modal-close-btn");

//   cartModalCloseBtn.addEventListener("click", () => {
//     const modalPortal = document.getElementById("modal-portal");
//     if (modalPortal) {
//       modalPortal.innerHTML = "";
//     }
//   });
// }

/** 개수 변경 함수 */
function limitHandler(state, render) {
  const limitSelect = document.getElementById("limit-select");

  limitSelect.addEventListener("change", async (event) => {
    const selectedLimit = event.target.value;

    // 상태 업데이트
    state.limit = parseInt(selectedLimit, 10);

    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (selectedLimit) {
      params.set("limit", selectedLimit);
    } else {
      params.delete("limit");
    }
    window.history.replaceState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`);

    state.page = 1;
    state.loading = true;
    render();

    const data = await getProducts({
      page: state.page,
      limit: state.limit,
      search: state.search,
      category1: state.category1,
      category2: state.category2,
    });

    state.allLoaded = false;
    state.products = data.products;
    state.total = data.pagination.total;
    state.loading = false;
    state.allLoaded = state.products.length >= data.pagination.total;

    // 렌더 호출
    render();
  });
}

/** 무한 스크롤 함수 */
function setupInfinityScrollObserver(state, render) {
  const observerElement = document.getElementById("observer");
  if (!observerElement) return;

  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !state.loading && !state.allLoaded) {
          state.page++;
          state.loading = true;
          render();

          const data = await getProducts({ page: state.page, limit: state.limit, search: state.search });

          // 기존 제품에 새로 불러온 제품 붙이기
          state.products = [...state.products, ...data.products];
          state.total = data.pagination.total;
          state.allLoaded = state.products.length >= data.pagination.total;

          state.loading = false;
          render();
        }
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    },
  );

  observer.observe(observerElement);
}

/** 장바구니 담기 토스트 */
function showAddToCartToast() {
  // 기존 토스트 제거
  const old = document.getElementById("toast-message");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "toast-message";
  toast.className = "fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50";

  toast.innerHTML = `
    <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <p class="text-sm font-medium">장바구니에 추가되었습니다</p>
      <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  // 닫기 버튼 이벤트
  toast.querySelector("#toast-close-btn").addEventListener("click", () => {
    toast.remove();
  });

  // 자동 제거 (예: 3초 뒤)
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/** 장바구니 담기 */
function addToCartHandler(state) {
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const product = state.products.find((p) => p.productId === productId);

      if (product) {
        // 중복 체크 없이 무조건 추가 (불변성 유지)
        state.cart = [...state.cart, product];
        updateCartCount(state.cart);
        showAddToCartToast();
      }
    });
  });
}

// 장바구니 수량 업데이트 함수
function updateCartCount(cart) {
  const countEl = document.querySelector("#cart-icon-btn span");
  if (countEl) {
    countEl.textContent = cart.length;
  }
}

/** 검색하기 */
async function handleSearch(value, state, render) {
  const keyword = value.trim().toLowerCase();

  const url = new URL(window.location.href);
  const params = url.searchParams;
  if (keyword) {
    params.set("search", keyword);
  } else {
    params.delete("search");
  }
  window.history.replaceState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`);

  state.loading = true;
  state.page = 1;
  state.search = keyword;
  render();

  const data = await getProducts({
    page: state.page,
    search: state.search,
    limit: state.limit,
    category1: state.category1,
    category2: state.category2,
  });
  state.allLoaded = false;
  state.products = data.products;
  state.total = data.pagination.total;
  state.loading = false;
  state.allLoaded = state.products.length >= data.pagination.total;

  render();
}

/** 카테고리 1뎁스 클릭 */
function handleCategory1Filter(state, render) {
  const category1Buttons = document.querySelectorAll(".category1-filter-btn");

  category1Buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const category1 = btn.dataset.category1;

      // 기존 쿼리스트링 유지 + category1만 변경
      const url = new URL(window.location.href);
      const params = url.searchParams;
      if (category1) {
        params.set("category1", category1);
        params.delete("category2"); // 1차 바뀌면 2차는 초기화
      } else {
        params.delete("category1");
        params.delete("category2");
      }
      window.history.replaceState({}, "", `${url.pathname}?${params}`);

      state.loading = true;
      state.page = 1;
      state.category1 = category1;
      state.category2 = "";
      render();

      const data = await getProducts({
        page: state.page,
        limit: state.limit,
        search: state.search,
        category1,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.allLoaded = state.products.length >= data.pagination.total;
      state.loading = false;

      render();
    });
  });
}

/** 카테고리 2뎁스 클릭 */
function handleCategory2Filter(state, render) {
  const category2Buttons = document.querySelectorAll(".category2-filter-btn");

  category2Buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const category2 = btn.dataset.category2;

      // 기존 쿼리스트링 유지 + category2만 변경
      const url = new URL(window.location.href);
      const params = url.searchParams;
      if (category2) {
        params.set("category2", category2);
      } else {
        params.delete("category2");
      }
      history.replaceState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`);

      state.loading = true;
      state.page = 1;
      state.category2 = category2;
      render();

      const data = await getProducts({
        page: state.page,
        limit: state.limit,
        search: state.search,
        category2: category2,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.allLoaded = state.products.length >= data.pagination.total;
      state.loading = false;

      render();
    });
  });
}

/** 브레드크럼 경로 클릭 */
function handleSetupBreadcrumb(state, render) {
  document.querySelectorAll('button[data-breadcrumb="category1"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;

      params.delete("category2");

      history.replaceState({}, "", `${url.pathname}?${params.toString()}`);

      const data = await getProducts({
        page: 1,
        limit: state.limit,
        category1: params.get("category1"),
        search: params.get("search"),
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.page = 1;
      state.loading = false;
      state.allLoaded = state.products.length >= data.pagination.total;

      render();
    });
  });
}

export default function handlers(state, render) {
  limitHandler(state, render);
  viewCartHandler(state, render);
  addToCartHandler(state);

  setupInfinityScrollObserver(state, render);
  closeCartModal();

  handleCategory1Filter(state, render);
  handleCategory2Filter(state, render);
  handleSetupBreadcrumb(state, render);

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = e.target.value.trim();
        handleSearch(value, state, render);
      }
    });
  }
}
