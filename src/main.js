import { getCategories, getProducts } from "./api/productApi.js";
import HomePage from "./pages/HomePage.js";
import DetailPage from "./pages/DetailPage.js";
import { addToCart } from "./services/productService.js";
import { loadCartFromStorage } from "./services/cartService.js";
import Router from "./router.js";

const getQueryFromURL = () => {
  const QUERIES = ["limit", "sort", "search", "category1", "category2"];
  const urlParams = new URLSearchParams(window.location.search);
  const result = QUERIES.reduce((acc, query) => {
    acc[query] = urlParams.get(query);
    return acc;
  }, {});
  return result;
};

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  isLoading: false,
  isLoadingMore: false,
  isCartModalOpen: false,
  products: [],
  limit: 20,
  currentPage: 1,
  hasMoreData: true,
  categories: {},
  selectedCategory1: null,
  selectedCategory2: null,
  sort: "price_asc",
  search: "",
  cartItems: [],
  selectedQuantity: 1, // 상품 상세 페이지에서 선택된 수량
};

// 라우터 설정
const routes = {
  "/": HomePage,
  "/product/:id": DetailPage,
};

let router;

const render = async () => {
  if (router) {
    await router.setState(state);
  }
};

async function main() {
  state.isLoading = true;

  const queries = getQueryFromURL();
  const { category1, category2, search, sort, limit } = queries;
  state = {
    ...state,
    limit: limit || 20,
    sort: sort || "price_asc",
    search: search || "",
    selectedCategory1: category1 || null,
    selectedCategory2: category2 || null,
  };

  console.log(state);

  // 라우터 초기화
  router = new Router(routes, document.body.querySelector("#root"));
  await router.setState(state);

  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });

  console.log(responese);

  const categories = await getCategories();
  state.cartItems = loadCartFromStorage();
  state.products = responese.products;
  state.categories = categories;

  state.isLoading = false;
  await render();
  setupEventListeners();
}

function setupEventListeners() {
  clickListener();
  changeListener();
  keydownListener();
}

const clickListener = () => {
  document.addEventListener("click", async (event) => {
    if (event.target.matches(".category1-filter-btn")) {
      const category1 = event.target.dataset.category1;
      handleCategory1(category1);
    }

    if (event.target.matches(".category2-filter-btn")) {
      const category2 = event.target.dataset.category2;
      handleCategory2(category2);
    }

    // 브레드크럼 클릭 이벤트
    if (event.target.matches("[data-breadcrumb]")) {
      const breadcrumbType = event.target.dataset.breadcrumb;
      if (breadcrumbType === "reset") {
        handleBreadcrumbReset();
      }
    }

    if (event.target.matches("[data-breadcrumb]")) {
      const breadcrumbType = event.target.dataset.breadcrumb;
      if (breadcrumbType === "category1") {
        handleBreadcrumbCategory1();
      }
    }

    if (event.target.matches("[data-breadcrumb]")) {
      const breadcrumbType = event.target.dataset.breadcrumb;
      if (breadcrumbType === "category2") {
        handleBreadcrumbCategory2();
      }
    }

    if (event.target.matches("#quantity-increase")) {
      handleQuantityIncrease();
    }

    if (event.target.matches("#quantity-decrease")) {
      handleQuantityDecrease();
    }

    if (event.target.matches("#quantity-input")) {
      handleQuantityInputChange(event.target.value);
    }

    if (event.target.matches("#add-to-cart-btn")) {
      handleAddToCartFromDetail(event);
    }

    // 상세 페이지에서 브레드크럼 클릭 이벤트 (홈으로 이동)
    if (event.target.matches(".breadcrumb-link[data-breadcrumb]")) {
      const breadcrumbType = event.target.dataset.breadcrumb;
      const category1 = event.target.dataset.category1;
      const category2 = event.target.dataset.category2;

      console.log("브레드크럼 클릭:", { breadcrumbType, category1, category2 });

      if (breadcrumbType === "category1" && category1 && category1 !== "") {
        // 상태 업데이트
        state.selectedCategory1 = category1;
        state.selectedCategory2 = null;
        await router.navigate(`/?category1=${category1}`);
      } else if (breadcrumbType === "category2" && category1 && category2 && category1 !== "" && category2 !== "") {
        // 상태 업데이트
        state.selectedCategory1 = category1;
        state.selectedCategory2 = category2;
        await router.navigate(`/?category1=${category1}&category2=${category2}`);
      }
    }

    // 카테고리1만 있는 요소 클릭 (category2가 없는 경우)
    if (event.target.matches("[data-category1]") && !event.target.matches("[data-category2]")) {
      const category1 = event.target.dataset.category1;
      await router.navigate(`/?category1=${category1}`);
    }

    // 카테고리2 클릭 이벤트 (category1도 함께 있는 경우)
    if (event.target.matches("[data-category2]") && event.target.matches("[data-category1]")) {
      const category2 = event.target.dataset.category2;
      const category1 = event.target.dataset.category1;
      console.log(category1, category2);
      await router.navigate(`/?category1=${category1}&category2=${category2}`);
    }

    if (event.target.matches("#cart-icon-btn")) {
      handleIcon();
    }

    // cart 모달 닫기 이벤트
    if (event.target.matches("#cart-modal-close-btn")) {
      closeCartModal();
    }

    if (event.target.matches(".add-to-cart-btn")) {
      handleAddToCart(event);
    }

    // 관련 상품 카드 클릭 시 상세 페이지로 이동
    if (event.target.matches(".related-product-card") || event.target.closest(".related-product-card")) {
      const relatedProductCard = event.target.closest(".related-product-card");
      if (relatedProductCard) {
        const productId = relatedProductCard.dataset.productId;
        if (productId) {
          // 상품 상세 페이지로 이동할 때 수량 초기화
          state.selectedQuantity = 1;
          await router.navigate(`/product/${productId}`);
        }
      }
    }

    // 상품 카드 클릭 시 상세 페이지로 이동할 때도 수량 초기화
    if (event.target.matches(".product-card") || event.target.closest(".product-card")) {
      // 장바구니 버튼 클릭이 아닌 경우에만 상세 페이지로 이동
      if (!event.target.matches(".add-to-cart-btn") && !event.target.closest(".add-to-cart-btn")) {
        const productCard = event.target.closest(".product-card");
        if (productCard) {
          const productId = productCard.dataset.productId;
          if (productId) {
            // 상품 상세 페이지로 이동할 때 수량 초기화
            state.selectedQuantity = 1;
            await router.navigate(`/product/${productId}`);
          }
        }
      }
    }
  });
};

const changeListener = () => {
  document.addEventListener("change", async (event) => {
    if (event.target.matches("#limit-select")) {
      handleLimitSelectChange(Number(event.target.value));
    }

    if (event.target.matches("#sort-select")) {
      handleSortChange(event.target.value);
    }

    if (event.target.matches("#quantity-input")) {
      handleQuantityInputChange(event.target.value);
    }
  });
};

const keydownListener = () => {
  document.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && event.target.matches("#search-input")) {
      handleSearch(event.target.value);
    }
  });
};

// 이벤트 핸들러 함수들을 전역 스코프로 이동
const handleCategory1 = async (category1) => {
  state.selectedCategory1 = category1;
  state.selectedCategory2 = null; // category2 초기화
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: category1,
  });
  state.products = responese.products;
  await router.navigate(`/?category1=${category1}`);
};

const handleCategory2 = async (category2) => {
  state.selectedCategory2 = category2;
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: category2,
  });
  state.products = responese.products;
  await router.navigate(`/?category1=${state.selectedCategory1}&category2=${category2}`);
};

const handleLimitSelectChange = async (limit) => {
  state.limit = limit;
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });
  state.products = responese.products;

  // URL 업데이트
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("limit", limit);
  await router.navigate(`/?${urlParams.toString()}`);
};

const handleSortChange = async (sort) => {
  state.sort = sort;
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });
  state.products = responese.products;

  // URL 업데이트
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort", sort);
  await router.navigate(`/?${urlParams.toString()}`);
};

const handleSearch = async (search) => {
  state.search = search;
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
  });
  state.products = responese.products;

  // URL 업데이트
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("search", search);
  await router.navigate(`/?${urlParams.toString()}`);
};

const handleIcon = async () => {
  // 모달 열기
  showCartModal();
  await render();
};

const handleAddToCart = async (event) => {
  const button = event.target.closest(".add-to-cart-btn");
  if (!button) return;

  const productId = button.getAttribute("data-product-id");
  const { success, message, items } = await addToCart(productId);

  if (success === false) {
    console.error(message);
    return;
  }

  state.cartItems = items;
  await render();
};

const showCartModal = async () => {
  state.isCartModalOpen = true;
  await render();
};

// cart 모달 닫기 함수 추가
const closeCartModal = async () => {
  state.isCartModalOpen = false;
  await render();
};

const handleBreadcrumbReset = async () => {
  state.selectedCategory1 = null;
  state.selectedCategory2 = null;
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
  });
  state.products = responese.products;
  await router.navigate("/");
};

const handleBreadcrumbCategory1 = async () => {
  state.selectedCategory2 = null;
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
  });
  state.products = responese.products;
  await router.navigate(`/?category1=${state.selectedCategory1}`);
};

const handleBreadcrumbCategory2 = async () => {
  const responese = await getProducts({
    page: state.currentPage,
    limit: state.limit,
    sort: state.sort,
    search: state.search,
    category1: state.selectedCategory1,
    category2: state.selectedCategory2,
  });
  state.products = responese.products;
  await render();
  await router.navigate(`/?category1=${state.selectedCategory1}&category2=${state.selectedCategory2}`);
};

// 수량 증가 핸들러
const handleQuantityIncrease = () => {
  const quantityInput = document.getElementById("quantity-input");
  const maxStock = quantityInput ? parseInt(quantityInput.max) || 107 : 107;

  if (state.selectedQuantity < maxStock) {
    state.selectedQuantity += 1;
    updateQuantityInput();
  }
};

// 수량 감소 핸들러
const handleQuantityDecrease = () => {
  if (state.selectedQuantity > 1) {
    state.selectedQuantity -= 1;
    updateQuantityInput();
  }
};

// 수량 입력 필드 변경 핸들러
const handleQuantityInputChange = (value) => {
  const quantityInput = document.getElementById("quantity-input");
  const maxStock = quantityInput ? parseInt(quantityInput.max) || 107 : 107;
  const quantity = parseInt(value) || 1;

  state.selectedQuantity = Math.max(1, Math.min(quantity, maxStock));
  updateQuantityInput();
};

// 수량 입력 필드 업데이트
const updateQuantityInput = () => {
  const quantityInput = document.getElementById("quantity-input");
  if (quantityInput) {
    quantityInput.value = state.selectedQuantity;
  }
};

// 상품 상세 페이지에서 장바구니 추가 핸들러
const handleAddToCartFromDetail = async (event) => {
  const button = event.target.closest("#add-to-cart-btn");
  if (!button) return;

  const productId = button.getAttribute("data-product-id");
  if (!productId) {
    console.error("상품 ID가 없습니다.");
    return;
  }

  // 선택된 수량만큼 장바구니에 추가
  const { success, message, items } = await addToCart(productId, state.selectedQuantity);

  if (success === false) {
    console.error(message);
    return;
  }

  state.cartItems = items;

  // 성공 메시지 표시
  showToast("장바구니에 추가되었습니다.", "success");

  await render();
};

// 토스트 메시지 표시 함수
const showToast = (message, type = "info") => {
  // 기존 토스트 제거
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast-message fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg transition-all duration-300 animate-slide-up ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // 3초 후 자동 제거
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
};

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
