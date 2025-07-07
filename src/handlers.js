import { getProducts } from "./api/productApi";

/** 개수 변경 함수 */
function limitHandler(state, render) {
  const limitSelect = document.getElementById("limit-select");

  limitSelect.addEventListener("change", async (event) => {
    const selectedLimit = event.target.value;

    // 상태 업데이트
    state.limit = parseInt(selectedLimit, 10);

    state.page = 1;
    state.loading = true;
    render();

    const data = await getProducts({ page: state.page, limit: state.limit });

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

          // 새 데이터 불러오기 (page와 limit 같이 전달)
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
        console.log("장바구니:", state.cart);
        // 중복 체크 없이 무조건 추가
        state.cart.push(product);
        showAddToCartToast();
      }
    });
  });
}

async function handleSearch(value, state, render) {
  const keyword = value.trim().toLowerCase();

  history.pushState({ keyword }, "", keyword ? `?search=${encodeURIComponent(keyword)}` : "/");

  state.loading = true;
  state.page = 1;
  state.search = keyword || "";
  render();

  const data = await getProducts({ page: state.page, search: state.search });
  state.allLoaded = false;
  state.products = data.products;
  state.total = data.pagination.total;
  state.loading = false;
  state.allLoaded = state.products.length >= data.pagination.total;

  render();
}

export default function handlers(state, render) {
  limitHandler(state, render);
  setupInfinityScrollObserver(state, render);
  addToCartHandler(state);

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    // 기존 이벤트 제거 (input이 자주 재생성되는 구조가 아니라면 removeEventListener로도 충분)
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = e.target.value.trim();
        if (value) {
          handleSearch(value, state, render);
        }
      }
    });
  }
}
