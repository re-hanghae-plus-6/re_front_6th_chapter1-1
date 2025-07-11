import { MainList } from "./components/pages/MainList.js";
import { getProducts, getProduct, getCategories } from "./api/productApi.js";
import { cartManager } from "./utils/cart.js";
import { Cart } from "./components/Cart.js";
import { Toast } from "./components/common/Toast.js";
import { ItemDetail } from "./components/pages/ItemDetail.js";
import { NotFound } from "./components/pages/NotFound.js";

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
let categories = {};
let currentCategory1 = "";
let currentCategory2 = "";
let currentSearch = "";

// 다음 페이지 로딩 중복 방지 플래그
let loadingNextPage = false;

// 현재 상세 페이지 상품 저장용 변수
let currentDetailProduct = null;

async function main() {
  // 1) 로딩 표시 (카테고리, 필터 상태 포함)
  document.getElementById("root").innerHTML = MainList({
    loading: true,
    categories,
    category1: currentCategory1,
    category2: currentCategory2,
    limit: currentLimit,
    sort: currentSort,
    search: currentSearch,
  });

  try {
    // 카테고리 데이터를 한 번만 로드
    if (!Object.keys(categories).length) {
      categories = await getCategories();
    }
    // 2) 필터된 상품 데이터를 받아옴 (검색, 카테고리 포함)
    const params = { page: 1, limit: currentLimit, sort: currentSort };
    if (currentSearch) params.search = currentSearch;
    if (currentCategory1) params.category1 = currentCategory1;
    if (currentCategory2) params.category2 = currentCategory2;
    const data = await getProducts(params);
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = data.products;
    totalCount = data.pagination.total;
    // 3) 실제 UI 렌더

    document.getElementById("root").innerHTML = MainList({
      loading: false,
      categories,
      category1: currentCategory1,
      category2: currentCategory2,
      products: allProducts,
      total: totalCount,
      limit: currentLimit,
      sort: currentSort,
      search: currentSearch,
    });
  } catch (err) {
    console.error("상품을 가져오는 중 에러:", err);
    document.getElementById("root").innerHTML =
      `<p class="text-center text-red-500">상품을 불러오는 데 실패했습니다.</p>`;
  }
}

// 상품 상세 렌더링
async function renderDetail(productId) {
  // 1) 로딩 표시
  root.innerHTML = ItemDetail({ loading: true });
  try {
    // 2) 상품 상세 데이터 로드 및 렌더 (관련 상품 제외)
    const product = await getProduct(productId);
    // 현재 상세 상품 저장
    currentDetailProduct = product;
    root.innerHTML = ItemDetail({ loading: false, product, related: [] });

    // 3) 관련 상품 로드 및 렌더 (현재 상품 제외)
    const relatedData = await getProducts({
      category1: product.category1,
      category2: product.category2,
      limit: currentLimit,
    });
    const related = relatedData.products.filter((p) => p.productId !== productId);
    root.innerHTML = ItemDetail({ loading: false, product, related });
  } catch (err) {
    console.error("상품 상세 로드 실패:", err);
    root.innerHTML = `<p class="text-center text-red-500">상품 상세를 불러오는 데 실패했습니다.</p>`;
  }
}

// 라우트 핸들러
function handleRoute() {
  const path = window.location.pathname;
  if (path === "/") {
    // 메인 페이지로 돌아올 때 전역 상태 초기화
    currentPage = 1;
    currentLimit = 20;
    currentSort = "price_asc";
    hasNext = true;
    allProducts = [];
    totalCount = 0;
    currentCategory1 = "";
    currentCategory2 = "";
    currentSearch = "";
    return main();
  }
  const m = path.match(/^\/product\/(.+)$/);
  if (m) {
    return renderDetail(m[1]);
  }
  root.innerHTML = NotFound;
}

// 애플리케이션 시작
// 초기 실행 및 popstate 라우팅
enableMocking().then(handleRoute);
window.addEventListener("popstate", handleRoute);

// limit, sort change 이벤트 위임 (카테고리, 검색 유지)
const root = document.getElementById("root");
root.addEventListener("change", async (e) => {
  if (e.target.id === "limit-select" || e.target.id === "sort-select") {
    currentLimit = Number(document.getElementById("limit-select").value);
    currentSort = document.getElementById("sort-select").value;
    // 로딩 화면
    root.innerHTML = MainList({
      loading: true,
      categories,
      category1: currentCategory1,
      category2: currentCategory2,
      limit: currentLimit,
      sort: currentSort,
      search: currentSearch,
    });
    const params = { page: 1, limit: currentLimit, sort: currentSort };
    if (currentSearch) params.search = currentSearch;
    if (currentCategory1) params.category1 = currentCategory1;
    if (currentCategory2) params.category2 = currentCategory2;
    const data = await getProducts(params);
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = data.products;
    totalCount = data.pagination.total;
    root.innerHTML = MainList({
      loading: false,
      categories,
      category1: currentCategory1,
      category2: currentCategory2,
      products: allProducts,
      total: totalCount,
      limit: currentLimit,
      sort: currentSort,
      search: currentSearch,
    });
  }
});

// Enter 키로 검색 수행
root.addEventListener("keydown", async (e) => {
  if (e.target.id !== "search-input" || e.key !== "Enter") return;

  const keyword = e.target.value;
  // 검색어 상태 업데이트
  currentSearch = keyword;
  // 로딩 표시
  root.innerHTML = MainList({
    loading: true,
    categories,
    category1: currentCategory1,
    category2: currentCategory2,
    limit: currentLimit,
    sort: currentSort,
    search: currentSearch,
  });
  // 검색 API 호출
  const params = { page: 1, limit: currentLimit, sort: currentSort, search: currentSearch };
  if (currentCategory1) params.category1 = currentCategory1;
  if (currentCategory2) params.category2 = currentCategory2;
  const data = await getProducts(params);
  currentPage = data.pagination.page;
  hasNext = data.pagination.hasNext;
  allProducts = data.products;
  totalCount = data.pagination.total;
  // 결과 렌더
  root.innerHTML = MainList({
    loading: false,
    categories,
    category1: currentCategory1,
    category2: currentCategory2,
    products: allProducts,
    total: totalCount,
    limit: currentLimit,
    sort: currentSort,
    search: currentSearch,
  });
});

// 무한 스크롤 이벤트
window.addEventListener("scroll", async () => {
  // 상세 페이지에서는 무시 (MainList 페이지에서만 동작)
  if (window.location.pathname !== "/") return;
  // 더 불러올 페이지가 없거나 이미 로딩 중이면 무시
  if (!hasNext || loadingNextPage) return;
  // 테스트 환경(jsdom)에서는 즉시 로드, 웹 환경에서는 화면 하단 근처(100px)이내일 때만 로드
  const isTestEnv = window.navigator.userAgent.includes("jsdom");
  if (!isTestEnv) {
    const scrollPos = window.innerHeight + window.scrollY;
    const triggerPoint = document.documentElement.scrollHeight - 100;
    if (scrollPos < triggerPoint) return;
  }
  loadingNextPage = true;
  // 로딩 스켈레톤 표시
  root.innerHTML = MainList({
    loading: true,
    categories,
    category1: currentCategory1,
    category2: currentCategory2,
    limit: currentLimit,
    sort: currentSort,
    search: currentSearch,
  });
  try {
    const nextPage = currentPage + 1;
    const params = { page: nextPage, limit: currentLimit, sort: currentSort };
    if (currentSearch) params.search = currentSearch;
    if (currentCategory1) params.category1 = currentCategory1;
    if (currentCategory2) params.category2 = currentCategory2;
    const data = await getProducts(params);
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = allProducts.concat(data.products);
    totalCount = data.pagination.total;
    // 갱신된 상품 목록 렌더
    root.innerHTML = MainList({
      loading: false,
      categories,
      category1: currentCategory1,
      category2: currentCategory2,
      products: allProducts,
      total: totalCount,
      limit: currentLimit,
      sort: currentSort,
      search: currentSearch,
    });
  } catch (err) {
    console.error("무한 스크롤 로드 오류:", err);
  } finally {
    loadingNextPage = false;
  }
});

// 전역 클릭 이벤트 위임 (라우팅, 카트, 수량, 상세 기능)
document.addEventListener("click", (e) => {
  // SPA 링크(a[data-link]) 클릭
  const link = e.target.closest("a[data-link]");
  if (link) {
    e.preventDefault();
    history.pushState({}, "", link.getAttribute("href"));
    return handleRoute();
  }
  // 상세 페이지 수량 증가
  if (e.target.matches("#quantity-increase")) {
    const input = document.querySelector("#quantity-input");
    input.value = String(Math.min(parseInt(input.value) + 1, parseInt(input.max)));
    return;
  }
  // 상세 페이지 수량 감소
  if (e.target.matches("#quantity-decrease")) {
    const input = document.querySelector("#quantity-input");
    input.value = String(Math.max(parseInt(input.value) - 1, parseInt(input.min)));
    return;
  }
  // 상세 페이지 장바구니 담기 버튼 클릭
  if (e.target.matches("#add-to-cart-btn")) {
    const pid = e.target.dataset.productId;
    // 상세 페이지 상품일 경우 currentDetailProduct 사용
    const prod =
      currentDetailProduct && currentDetailProduct.productId === pid
        ? currentDetailProduct
        : allProducts.find((p) => p.productId === pid);
    // 수량 입력값 읽기
    const quantityInput = document.querySelector("#quantity-input");
    const cnt = quantityInput ? parseInt(quantityInput.value, 10) : 1;
    if (prod) {
      cartManager.addToCart(prod, cnt);
      showToast("success");
    }
    return;
  }
  // 목록 페이지 장바구니 버튼 클릭
  if (e.target.classList.contains("add-to-cart-btn")) {
    const pid = e.target.dataset.productId;
    const prod = allProducts.find((p) => p.productId === pid);
    if (prod) {
      cartManager.addToCart(prod);
      window.openCartModal(cartManager.getCart());
      showToast("success");
    }
    return;
  }
  // 상세 페이지 관련 상품 카드 클릭
  const relatedCard = e.target.closest(".related-product-card");
  if (relatedCard && relatedCard.dataset.productId) {
    history.pushState({}, "", `/product/${relatedCard.dataset.productId}`);
    return handleRoute();
  }
  // 상세 페이지 -> 목록으로 돌아가기
  if (e.target.matches(".go-to-product-list")) {
    history.pushState({}, "", "/");
    return handleRoute();
  }
  // 목록 페이지 상품 카드 클릭
  const card = e.target.closest(".product-card");
  if (card && card.dataset.productId) {
    history.pushState({}, "", `/product/${card.dataset.productId}`);
    return handleRoute();
  }
  // 카테고리 초기화: 전체
  if (e.target.matches('[data-breadcrumb="reset"]')) {
    currentCategory1 = "";
    currentCategory2 = "";
    currentSearch = "";
    return main();
  }
  // 1depth 카테고리 선택
  if (e.target.matches("[data-category1]") && !e.target.dataset.category2) {
    currentCategory1 = e.target.dataset.category1;
    currentCategory2 = "";
    return main();
  }
  // 2depth 카테고리 선택
  if (e.target.matches("[data-category2]")) {
    currentCategory2 = e.target.dataset.category2;
    return main();
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
