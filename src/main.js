import { getCategories, getProducts } from "./api/productApi.js";
import { HomePage } from "./pages/HomePage.js";
import { CartModal } from "./components/CartModal.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  products: [],
  total: 0,
  loading: false,
  categories: {},
  productCount: 20,
  page: 1,
  hasNext: false,
  hasPrev: false,
  sort: "price_asc",
  cart: [],
  selectedCartItems: [], // 선택된 장바구니 아이템 ID들
  search: "",
  selectedCategory1: null,
  selectedCategory2: null,
};

function render() {
  document.body.querySelector("#root").innerHTML = HomePage(state);
  setupInfiniteScroll();
}

async function main() {
  // 초기값 - 로딩 상태 렌더링
  state.loading = true;
  render();

  // data fetch
  const [
    {
      products,
      pagination: { page, total, hasNext, hasPrev },
    },
    categories,
  ] = await Promise.all([
    getProducts({ limit: state.productCount, sort: state.sort, search: state.search }),
    getCategories(),
  ]);

  state.total = total;
  state.products = products;
  state.categories = categories;
  state.page = page;
  state.hasNext = hasNext;
  state.hasPrev = hasPrev;

  // 값 가져왔으니 로딩 상태 해제
  state.loading = false;

  render();
}

function setupEventListeners() {
  document.addEventListener("change", async (event) => {
    if (event.target.matches("#limit-select")) {
      handleLimitChange(Number(event.target.value));
    }
    if (event.target.matches("#sort-select")) {
      handleSortChange(event.target.value);
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".add-to-cart-btn")) {
      const productId = event.target.dataset.productId;
      addToCart(productId);
      showToast({ type: "add" });
    }

    if (event.target.matches(".category1-filter-btn")) {
      const category1 = event.target.dataset.category1;
      handleCategory1Filter(category1);
    }

    if (event.target.matches(".category2-filter-btn")) {
      const category2 = event.target.dataset.category2;
      handleCategory2Filter(category2);
    }

    if (event.target.matches(".category-reset-btn")) {
      handleCategoryReset();
    }

    const cartButton = document.querySelector("#cart-icon-btn");
    if (cartButton && (event.target === cartButton || cartButton.contains(event.target))) {
      showCartModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("#search-input")) {
      const searchValue = event.target.value;
      handleSearch(searchValue);
    }
  });
}

async function handleCategory1Filter(category1) {
  state.selectedCategory1 = category1;
  const categoryDetail = state.categories[category1];

  state.categories = categoryDetail;
  render();
}

async function handleCategory2Filter(category2) {
  state.selectedCategory2 = category2;

  const {
    products,
    pagination: { total },
  } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    category1: state.selectedCategory1,
    category2: category2,
  });

  state.products = products;
  state.total = total;

  render();
}

async function handleCategoryReset() {
  state.selectedCategory1 = null;
  state.selectedCategory2 = null;
  render();
}

async function handleSearch(searchValue) {
  state.search = searchValue;

  state.loading = true;
  const { products, pagination } = await getProducts({
    limit: state.productCount,
    sort: state.sort,
    search: state.search,
  });

  state.products = products;
  state.page = pagination.page;
  state.hasNext = pagination.hasNext;
  state.hasPrev = pagination.hasPrev;
  state.loading = false;
  state.total = pagination.total;

  render();
}

function addToCart(productId) {
  const product = state.products.find((p) => p.productId === productId);

  if (product) {
    state.cart.push(product);
  }
  render();
}

function removeFromCart(productId) {
  // 해당 상품의 첫 번째 인스턴스만 제거
  const index = state.cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    state.cart.splice(index, 1);
    // 선택된 아이템에서도 제거
    state.selectedCartItems = state.selectedCartItems.filter((id) => id !== productId);

    // 모달이 열려있다면 모달만 다시 렌더링
    if (document.querySelector(".cart-modal")) {
      renderCartModal();
    }

    showToast({ type: "delete" });
  }
}

function toggleCartItemSelection(productId) {
  const index = state.selectedCartItems.indexOf(productId);

  if (index === -1) {
    // 선택되지 않았다면 추가
    state.selectedCartItems.push(productId);
  } else {
    // 이미 선택되었다면 제거
    state.selectedCartItems.splice(index, 1);
  }

  // 모달만 다시 렌더링
  if (document.querySelector(".cart-modal")) {
    renderCartModal();
  }
}

function renderCartModal() {
  // 기존 이벤트 리스너 정리
  if (modalClickHandler) {
    document.removeEventListener("click", modalClickHandler);
    modalClickHandler = null;
  }
  if (modalKeydownHandler) {
    document.removeEventListener("keydown", modalKeydownHandler);
    modalKeydownHandler = null;
  }

  // 기존 모달 제거
  const existingModal = document.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 새 모달 생성
  const modalHTML = CartModal({
    cart: state.cart,
    selectedCartItems: state.selectedCartItems,
  });

  document.querySelector("#modal-root").insertAdjacentHTML("beforeend", modalHTML);
  setupModalEvents();
}

function showCartModal() {
  // 이미 모달이 열려있다면 return
  if (document.querySelector(".cart-modal")) {
    return;
  }

  // 컴포넌트를 사용해서 모달 HTML 생성
  const modalHTML = CartModal({
    cart: state.cart,
    selectedCartItems: state.selectedCartItems,
  });

  // DOM에 추가
  document.querySelector("#modal-root").insertAdjacentHTML("beforeend", modalHTML);
  setupModalEvents();
}

let modalClickHandler = null;
let modalKeydownHandler = null;

function setupModalEvents() {
  const modal = document.querySelector(".cart-modal");
  if (!modal) return;

  // 기존 이벤트 리스너 제거
  if (modalClickHandler) {
    document.removeEventListener("click", modalClickHandler);
  }
  if (modalKeydownHandler) {
    document.removeEventListener("keydown", modalKeydownHandler);
  }

  // 새로운 이벤트 리스너 생성
  modalClickHandler = (event) => {
    // 체크박스 클릭
    if (event.target.matches(".cart-item-checkbox")) {
      const productId = event.target.dataset.productId;
      toggleCartItemSelection(productId);
      return;
    }

    if (event.target.matches("#cart-modal-select-all-checkbox")) {
      // 현재 전체 선택 상태 확인 (중복 상품 제거한 배열로 확인)
      const uniqueCartItems = [...new Set(state.cart.map((item) => item.productId))];
      const isAllChecked = uniqueCartItems.every((productId) => state.selectedCartItems.includes(productId));

      if (isAllChecked) {
        // 모든 아이템이 선택되어 있다면 전체 해제
        state.selectedCartItems = [];
      } else {
        // 일부만 선택되어 있거나 아무것도 선택되지 않았다면 전체 선택
        state.selectedCartItems = uniqueCartItems;
      }

      renderCartModal();
      return;
    }

    if (event.target.matches(".cart-item-remove-btn")) {
      const productId = event.target.dataset.productId;
      removeFromCart(productId);
      return;
    }

    // 닫기 버튼 클릭 (모든 닫기 버튼 확인)
    const closeButtons = document.querySelectorAll(".modal-close-btn");
    for (const closeBtn of closeButtons) {
      if (event.target === closeBtn || closeBtn.contains(event.target)) {
        closeCartModal();
        return;
      }
    }

    // 배경 클릭으로 닫기
    if (event.target.matches(".cart-modal")) {
      closeCartModal();
    }
  };

  modalKeydownHandler = (event) => {
    if (event.key === "Escape") {
      closeCartModal();
    }
  };

  // 이벤트 리스너 등록
  document.addEventListener("click", modalClickHandler);
  document.addEventListener("keydown", modalKeydownHandler);
}

function closeCartModal() {
  const modal = document.querySelector(".cart-modal");
  if (modal) {
    modal.remove();

    // 이벤트 리스너 정리
    if (modalClickHandler) {
      document.removeEventListener("click", modalClickHandler);
      modalClickHandler = null;
    }
    if (modalKeydownHandler) {
      document.removeEventListener("keydown", modalKeydownHandler);
      modalKeydownHandler = null;
    }
  }
}

function showToast({ type = "add" }) {
  const config = {
    add: {
      bg: "bg-green-600",
      message: "장바구니에 추가되었습니다.",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
    },
    delete: {
      bg: "bg-blue-600",
      message: "선택한 상품들이 삭제되었습니다.",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    },
    error: {
      bg: "bg-red-600",
      message: "오류가 발생했습니다.",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
    },
  };

  const { bg, message: toastMessage, icon } = config[type];

  // 토스트 HTML 생성
  const toastHTML = `
    <div class="toast-container fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div class="${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icon}
          </svg>
        </div>
        <p class="text-sm font-medium">${toastMessage}</p>
        <button class="toast-close-btn flex-shrink-0 ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", toastHTML);

  // 자동으로 3초 후 제거
  const toastElement = document.querySelector(".toast-container:last-child");
  setTimeout(() => {
    toastElement?.remove();
  }, 3000);

  // 닫기 버튼 이벤트
  toastElement?.querySelector(".toast-close-btn")?.addEventListener("click", () => {
    toastElement.remove();
  });
}

async function handleLimitChange(newLimit) {
  state.productCount = newLimit;
  state.loading = true;
  render();

  // 새로운 limit으로 API 재호출
  const {
    products,
    pagination: { total },
  } = await getProducts({ limit: state.productCount, sort: state.sort });

  // 상태 업데이트
  state.products = products;
  state.total = total;
  state.loading = false;

  render();
}

async function handleSortChange(newSort) {
  state.sort = newSort;
  state.loading = true;

  const {
    products,
    pagination: { total },
  } = await getProducts({ limit: state.productCount, sort: newSort });

  // 상태 업데이트
  state.products = products;
  state.total = total;
  state.loading = false;

  render();
}

let globalObserver = null;

async function loadMoreProducts() {
  if (state.loading || !state.hasNext) return;

  state.loading = true;
  render();

  // 1. 새 데이터 가져오기
  const newData = await getProducts({ limit: state.productCount, page: state.page + 1 });

  // 2. 기존 배열에 추가 및 상태 변경
  state.products = [...state.products, ...newData.products];
  state.hasNext = newData.pagination.hasNext;
  state.hasPrev = newData.pagination.hasPrev;
  state.page = newData.pagination.page;
  state.loading = false;

  // 3. 다시 그리기
  render();
}

function setupInfiniteScroll() {
  // 기존 observer 정리
  if (globalObserver) {
    globalObserver.disconnect();
  }
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && state.hasNext && !state.loading) {
        console.log("무한스크롤 트리거됨", state.page);
        loadMoreProducts();
      }
    });
  };
  globalObserver = new IntersectionObserver(callback);

  const sentinel = document.getElementById("scroll-sentinel");
  if (sentinel) {
    globalObserver.observe(sentinel);
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    main();
    setupEventListeners();
  });
} else {
  main();
  setupEventListeners();
}
