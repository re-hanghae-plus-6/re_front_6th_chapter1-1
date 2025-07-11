import { MainList } from "./components/pages/MainList.js";
import { getProducts } from "./api/productApi.js";
import { cartManager } from "./utils/cart.js";
import { Cart } from "./components/Cart.js";
import { Toast } from "./components/common/Toast.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// infinite scroll 상태 관리
let totalCount = 0;
let currentPage = 1;
let currentLimit = 20;
let currentSort = "price_asc";
let hasNext = true;
let allProducts = [];

async function main() {
  // 1) 로딩 표시
  document.getElementById("root").innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort });

  try {
    // 2) MSW mock 데이터를 받아옴
    const data = await getProducts({ page: 1, limit: currentLimit, sort: currentSort });
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = data.products;
    totalCount = data.pagination.total;
    // 3) 실제 UI 렌더

    document.getElementById("root").innerHTML = MainList({
      loading: false,
      products: allProducts,
      total: totalCount,
      limit: currentLimit,
      sort: currentSort,
    });
  } catch (err) {
    console.error("상품을 가져오는 중 에러:", err);
    document.getElementById("root").innerHTML =
      `<p class="text-center text-red-500">상품을 불러오는 데 실패했습니다.</p>`;
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
}
// else {main()}을 없애는게 테스트를 통과하는데 매우매우 중요

// limit, sort change 이벤트 위임
const root = document.getElementById("root");
root.addEventListener("change", async (e) => {
  if (e.target.id === "limit-select" || e.target.id === "sort-select") {
    currentLimit = Number(document.getElementById("limit-select").value);
    currentSort = document.getElementById("sort-select").value;
    // 로딩 화면
    root.innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort });
    const data = await getProducts({ page: 1, limit: currentLimit, sort: currentSort });
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = data.products;
    totalCount = data.pagination.total;
    root.innerHTML = MainList({
      loading: false,
      products: allProducts,
      total: totalCount,
      limit: currentLimit,
      sort: currentSort,
    });
  }
});

// Enter 키로 검색 수행
root.addEventListener("keydown", async (e) => {
  if (e.target.id !== "search-input" || e.key !== "Enter") return;

  const keyword = e.target.value;
  // 로딩 표시
  root.innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort, search: keyword });
  // 검색 API 호출
  const data = await getProducts({ page: 1, limit: currentLimit, sort: currentSort, search: keyword });
  currentPage = data.pagination.page;
  hasNext = data.pagination.hasNext;
  allProducts = data.products;
  totalCount = data.pagination.total;
  // 결과 렌더
  root.innerHTML = MainList({
    loading: false,
    products: allProducts,
    total: totalCount,
    limit: currentLimit,
    sort: currentSort,
    search: keyword,
  });
});

// 무한 스크롤 이벤트
window.addEventListener("scroll", async () => {
  if (!hasNext) return;
  const scrollPos = window.innerHeight + window.scrollY;
  const threshold = document.documentElement.scrollHeight - 100;
  if (scrollPos >= threshold) {
    // 전체 로딩 스켈레톤 렌더
    root.innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort });
    // 다음 페이지 데이터 fetch
    const nextPage = currentPage + 1;
    const data = await getProducts({ page: nextPage, limit: currentLimit, sort: currentSort });
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    // 기존 배열에 추가 후 전체 UI 갱신
    allProducts = allProducts.concat(data.products);
    totalCount = data.pagination.total;
    root.innerHTML = MainList({
      loading: false,
      products: allProducts,
      total: totalCount,
      limit: currentLimit,
      sort: currentSort,
    });
  }
});

// 카트 관련 이벤트 위임
document.addEventListener("click", (e) => {
  // 장바구니 담기 버튼 클릭
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.dataset.productId;
    const product = allProducts.find((p) => p.productId === productId);
    if (product) {
      cartManager.addToCart(product);
      window.openCartModal(cartManager.getCart());
      // 토스트 메시지 표시
      showToast("success");
    }
  }
});

// 모달 이벤트 설정 함수
function setupModalEvents(modalRoot) {
  // 닫기 함수
  function closeModal() {
    modalRoot.innerHTML = "";
    window.removeEventListener("keydown", handleEsc);
  }

  // ESC 키 핸들러
  function handleEsc(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  // 닫기 버튼 이벤트
  modalRoot.querySelector("#cart-modal-close-btn")?.addEventListener("click", closeModal);

  // 모달 전체 클릭 이벤트 (dimmed 배경 클릭 시에만 닫기)
  modalRoot.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-modal-overlay")) {
      closeModal();
    }
  });

  // ESC 키 이벤트
  window.addEventListener("keydown", handleEsc);

  // 모달 내용에 직접 이벤트 리스너 추가
  const modalInner = modalRoot.querySelector('[style*="pointer-events: auto"]');
  if (modalInner) {
    modalInner.addEventListener("click", (e) => {
      // 수량 증가: 전체 재렌더링 대신 input, 가격, 총액만 업데이트
      if (e.target.classList.contains("quantity-increase-btn") || e.target.closest(".quantity-increase-btn")) {
        const btn = e.target.closest(".quantity-increase-btn");
        const pid = btn.dataset.productId;
        cartManager.increaseQuantity(pid);
        // input.value 업데이트
        const input = modalRoot.querySelector(`.quantity-input[data-product-id="${pid}"]`);
        const item = cartManager.getCart().find((i) => i.productId === pid);
        input.value = item.quantity;
        // 개별 아이템 총액 업데이트
        const priceEl = modalRoot.querySelector(`.cart-item[data-product-id="${pid}"] p.text-sm.font-medium`);
        priceEl.textContent = `${item.lprice * item.quantity}원`;
        // footer 총 금액 업데이트
        const totalEl = modalRoot.querySelector(".sticky.bottom-0 .text-xl.font-bold.text-blue-600");
        const total = cartManager.getCart().reduce((sum, i) => sum + i.lprice * i.quantity, 0);
        totalEl.textContent = `${total.toLocaleString()}원`;
        return;
      }

      // 수량 감소: 전체 재렌더링 대신 input, 가격, 총액만 업데이트
      if (e.target.classList.contains("quantity-decrease-btn") || e.target.closest(".quantity-decrease-btn")) {
        const btn = e.target.closest(".quantity-decrease-btn");
        const pid = btn.dataset.productId;
        cartManager.decreaseQuantity(pid);
        const cart = cartManager.getCart();
        const item = cart.find((i) => i.productId === pid);

        if (item) {
          // 남아 있는 경우만 value, 가격 업데이트
          const input = modalRoot.querySelector(`.quantity-input[data-product-id="${pid}"]`);
          input.value = item.quantity;
          const priceEl = modalRoot.querySelector(`.cart-item[data-product-id="${pid}"] p.text-sm.font-medium`);
          priceEl.textContent = `${item.lprice * item.quantity}원`;
        } else {
          // quantity 1→0 으로 삭제된 경우 DOM에서 제거
          modalRoot.querySelector(`.cart-item[data-product-id="${pid}"]`).remove();
        }

        // footer 총 금액 업데이트
        const totalEl = modalRoot.querySelector(".sticky.bottom-0 .text-xl.font-bold.text-blue-600");
        const total = cart.reduce((sum, i) => sum + i.lprice * i.quantity, 0);
        totalEl.textContent = `${total.toLocaleString()}원`;
        return;
      }

      // 장바구니에서 삭제 버튼 클릭
      if (e.target.classList.contains("cart-item-remove-btn")) {
        const productId = e.target.dataset.productId;
        cartManager.removeFromCart(productId);
        // 모달 다시 렌더링
        modalRoot.innerHTML = Cart(cartManager.getCart());
        // 모달 이벤트 리스너 다시 연결
        setupModalEvents(modalRoot);
        // 토스트 메시지 표시
        showToast("info");
      }

      // 전체 선택 체크박스 클릭
      if (e.target.id === "cart-modal-select-all-checkbox") {
        cartManager.toggleSelected();
        modalRoot.innerHTML = Cart(cartManager.getCart());
        setupModalEvents(modalRoot);
      }

      // 장바구니 항목 선택 체크박스 클릭
      if (e.target.classList.contains("cart-item-checkbox")) {
        const productId = e.target.dataset.productId;
        cartManager.toggleSelected(productId);
        modalRoot.innerHTML = Cart(cartManager.getCart());
        setupModalEvents(modalRoot);
      }

      // 선택한 상품 삭제 버튼 클릭
      if (e.target.id === "cart-modal-remove-selected-btn") {
        cartManager.removeSelectedItems();
        modalRoot.innerHTML = Cart(cartManager.getCart());
        setupModalEvents(modalRoot);
        showToast("info");
      }

      // 전체 비우기 버튼 클릭
      if (e.target.id === "cart-modal-clear-cart-btn") {
        cartManager.resetCart();
        // 모달 다시 렌더링
        modalRoot.innerHTML = Cart(cartManager.getCart());
        // 모달 이벤트 리스너 다시 연결
        setupModalEvents(modalRoot);
        // 토스트 메시지 표시
        showToast("info");
      }
    });
  }
}

// 전역에서 사용할 수 있도록 window 객체에 추가
window.setupModalEvents = setupModalEvents;

// 토스트 메시지 함수
function showToast(type = "success") {
  // 새로운 토스트를 추가하기 전에, 이전 토스트는 무조건 제거
  document.querySelectorAll(".fixed.top-4.right-4.z-\\[1000\\]").forEach((el) => el.remove());

  const toastContainer = document.createElement("div");
  toastContainer.className = "fixed top-4 right-4 z-[1000]";
  toastContainer.innerHTML = Toast(type);
  document.body.appendChild(toastContainer);

  // 닫기 버튼 이벤트
  toastContainer.querySelector("#toast-close-btn")?.addEventListener("click", () => {
    toastContainer.remove();
  });

  // 3초 후 자동 제거
  setTimeout(() => {
    if (toastContainer.parentNode) {
      toastContainer.remove();
    }
  }, 3000);
}

window.addEventListener("popstate", () => {
  // 라우트 변경 시 페이지네이션, 정렬 등 상태 초기화
  currentPage = 1;
  currentLimit = 20;
  currentSort = "price_asc";
  hasNext = true;
  allProducts = [];
  main();
});
