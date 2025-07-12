import { HomePage } from "./pages/HomePage.js";
import { getCategories, getProducts } from "./api/productApi.js";
import { ProductCard } from "./pages/components/ProductCard.js";
import { PageRouter } from "./pages/route/PageRouter.js";
const base = import.meta.env.BASE_URL || "/";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${base}mockServiceWorker.js`,
      },
    }),
  );

// 초기 상태 설정
let state = {
  products: [],
  total: 0,
  loading: false,
  limit: 20,
  sort: "price_asc",
  isFirstLoad: true, // 첫 로드 여부
  categories: [],
  search: "",
  cartSelect: false, // 장바구니 선택 상태
  cartItmes: [], // 장바구니 아이템 목록
};

// 페이지 렌더링 함수
function render() {
  const path = window.location.pathname;
  console.log("현재 경로:", path);
  console.log("render을 통해 렌더링 상태", state);
  const root = document.getElementById("root");
  const saveSort = localStorage.getItem("sort");
  if (saveSort) {
    state.sort = saveSort; // 로컬 스토리지에서 정렬 상태 불러오기
  }
  const saveCartItems = localStorage.getItem("cartItems");
  if (saveCartItems) {
    state.cartItems = JSON.parse(saveCartItems); // 로컬 스토리지에서 장바구니 아이템 목록 불러오기
  } else {
    state.cartItems = []; // 장바구니 아이템 목록 초기화
  }
  const saveSearch = localStorage.getItem("search");
  if (saveSearch) {
    state.search = saveSearch; // 로컬 스토리지에서 검색어 불러오기
  }
  const saveLimit = localStorage.getItem("limit");
  if (saveLimit) {
    state.limit = parseInt(saveLimit, 10); // 로컬 스토리지에서 페이지당 상품 수 불러오기
  }

  root.innerHTML = HomePage({
    ...state, // 상태를 HomePage에 전달
    selectedCategory, // 선택된 카테고리 상태 전달
  });

  attachEvents(); // ✅ 이벤트 연결
  searchProductsEvent(); // 검색 이벤트 연결
}

function makeUrl() {
  let url = base;
  let params = [];
  if (state.search) params.push(`search=${encodeURIComponent(state.search)}`);
  if (state.limit) params.push(`limit=${state.limit}`);
  if (state.sort) params.push(`sort=${state.sort}`);
  if (params.length > 0) {
    url += "?" + params.join("&");
  }
  return url;
}

// 카테고리 선택 상태
let selectedCategory = {
  category1: "",
  category2: "",
};

//limit 변경 시 상품 목록만 다시 렌더링
function renderProductList() {
  const productContainer = document.getElementById("products-grid"); // 상품 목록 감싸는 div
  if (!productContainer) return;

  const visibleProducts = state.products.slice(0, state.limit);
  console.log("렌더링할 상품 목록:", visibleProducts);
  productContainer.innerHTML = visibleProducts
    .map((p) => ProductCard(p))
    .concat(state.loading ? `<div class="text-center text-gray-500">로딩 중...</div>` : "")
    .join("");
}

//버튼, limit, sort 클릭 시 동작
export function attachEvents() {
  console.log("attachEvents 호출됨");
  // limit, sort 변경 이벤트
  const limitSelect = document.querySelector("#limit-select");
  const sortSelect = document.getElementById("sort-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", async (e) => {
      console.log("limitSelect 이벤트 발생", e.target.value);

      state.limit = parseInt(e.target.value);
      //history.pushState({}, "", `/limit=${state.limit}/`);
      history.pushState({}, "", makeUrl()); // URL 업데이트
      localStorage.setItem("limit", state.limit);
      state.loading = true;

      const data = await getProducts({
        limit: state.limit,
        sort: state.sort,
        search: state.search,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;

      renderProductList(); // ✅ 전체가 아닌 목록만 다시 그림
      console.log("limitSelect 이벤트 발생 후 상태", state);
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", async (e) => {
      state.sort = e.target.value;
      //history.pushState({}, "", `/sort=${state.sort}/`);
      history.pushState({}, "", makeUrl()); // URL 업데이트

      localStorage.setItem("sort", state.sort); // 정렬 상태를 로컬 스토리지에 저장
      state.loading = true;
      render();

      const data = await getProducts({
        limit: state.limit,
        sort: state.sort,
        search: state.search,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      render();
    });
  }

  let cartItems2 = state.cartItems;

  // 장바구니 담기 버튼 클릭 이벤트
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("장바구니 담기 버튼 클릭됨", e.target.dataset.productId);
      const productId = e.target.dataset.productId;
      console.log("장바구니 현황:", productId);
      if (cartItems2.length === 0) {
        cartItems2.push(productId);
        console.log("장바구니가 비어 있어서 추가:", productId); // 장바구니가 비어있을 때 상품 추가
      } else {
        let isDuplicate = false; // 중복 여부 플래그
        cartItems2.map((item) => {
          console.log("장바구니 아이템 확인:", item);
          console.log("현재 상품 ID:", productId);

          if (item === productId) {
            console.log("이미 장바구니에 담긴 상품입니다:", productId); // 이미 장바구니에 담긴 상품은 추가하지 않음
            isDuplicate = true;
            return;
          }
        });
        if (!isDuplicate) {
          cartItems2.push(productId); // 장바구니에 상품 추가
          console.log("존재하지 않는 상품 장바구니에 상품 추가됨:", productId);
        }
      }

      // 장바구니에 담긴 상품 ID 저장
      console.log("장바구니에 담긴 상품 ID:", cartItems2);
      state.cartItems = cartItems2; // 상태에 장바구니 아이템 목록 저장
      console.log("장바구니에 담긴 상품 ID:", state.cartItems.length);
      localStorage.setItem("cartItems", JSON.stringify(cartItems2)); // 로컬 스토리지에 저장

      state.cartSelect = true; // 장바구니 선택 상태 업데이트
      render(); // 장바구니 선택 상태 반영
      setTimeout(() => {
        state.cartSelect = false; // 2초 후 장바구니 선택 상태 초기화
        render(); // 장바구니 선택 상태 반영
      }, 2000); // 2초 후 초기화
      // 장바구니에
    });
  });
  //이미지 클릭 시 상세 페이지 이동 이벤트
  document.querySelectorAll(".product-image").forEach((card) => {
    card.addEventListener("click", async (e) => {
      const productId = e.target.closest(".product-card").dataset.productId;
      console.log("이동할 productId:", productId);
      history.pushState({}, "", `/product/${productId}`);
      //attachEvents(); // 이벤트 재연결
      await PageRouter();
      removeInfiniteScroll();
    });
  });

  // 카테고리 버튼 클릭 이벤트
  document.querySelectorAll(".category1-filter-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      selectedCategory.category1 = btn.dataset.category1;
      selectedCategory.category2 = "";
      state.loading = true;
      console.log("카테고리1 선택됨:", selectedCategory.category1);
      render();

      const data = await getProducts({
        ...selectedCategory,
        sort: state.sort,
        limit: state.limit,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      state.categories = await getCategories(); // 카테고리 데이터 fetch
      render(); // 👉 여기서 2depth 버튼 생김
    });
  });
  // 카테고리 버튼 클릭 이벤트
  document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      selectedCategory.category2 = btn.dataset.category2;
      state.loading = true;
      render();

      const data = await getProducts({
        ...selectedCategory,
        sort: state.sort,
        limit: state.limit,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      render(); // 👉 선택된 버튼 색상 반영
    });
  });

  const resetBtn = document.querySelector("[data-breadcrumb='reset']");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      selectedCategory = { category1: "", category2: "" };
      state.loading = true;
      render();

      const data = await getProducts({
        sort: state.sort,
        limit: state.limit,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      render();
    });
  }
}

//상세페이지 수량 +,- 버튼 클릭
document.addEventListener("click", (e) => {
  // + 버튼
  if (e.target.closest("#quantity-increase")) {
    const input = document.getElementById("quantity-input");
    const max = parseInt(input.max, 10) || 9999;
    let value = parseInt(input.value, 10) || 1;
    if (value < max) input.value = value + 1;
  }
  // - 버튼
  if (e.target.closest("#quantity-decrease")) {
    const input = document.getElementById("quantity-input");
    let value = parseInt(input.value, 10) || 1;
    if (value > 1) input.value = value - 1;
  }
});

document.addEventListener("click", async (e) => {
  const cardElem = e.target.closest(".related-product-card");
  if (cardElem) {
    const productId = cardElem.dataset.productId;
    console.log("✅ 이동할 productId:", productId);
    history.pushState({}, "", `/product/${productId}`);
    await PageRouter();
    removeInfiniteScroll();
  }
});
// 데이터 fetch 및 렌더링 함수
async function fetchAndRender() {
  state.loading = true;
  state.total = 0; // 로딩 시작 시 0으로 초기화
  render();
  // 데이터 fetch
  const [
    {
      products,
      pagination: { total },
    },
  ] = await Promise.all([
    getProducts({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      search: state.search,
    }),
  ]);

  const categories = await getCategories(); // 카테고리 데이터 fetch
  state.categories = categories; // 상태에 저장

  state = {
    ...state,
    products,
    total,
    loading: false,
    isFirstLoad: false,
    //categories: [], // 카테고리 데이터 초기화
  };
  console.log("fetchAndRender 사용 ::: 상품 데이터 로드 완료", state);
  render();
}

export async function getRelatedProducts(product) {
  let relatedPd = [];
  // 같은 카테고리의 상품 목록을 불러옴
  console.log("getRelatedProducts 호출", product);
  const { category1, category2, productId } = product;
  const data = await getProducts({
    category1,
    category2,
    limit: 10, // 원하는 만큼
  });
  console.log("getRelatedProducts 데이터", data);
  // 본인 상품은 제외
  relatedPd = data.products.filter((item) => item.productId !== productId);
  console.log("getRelatedProducts 결과", relatedPd);
  return relatedPd;
}
// 무한 스크롤 설정
let isFetching = false;
let infiniteScrollHandler = null;
function setupInfiniteScroll() {
  infiniteScrollHandler = async function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching && !state.loading) {
      isFetching = true;
      state.loading = true;

      const prevScrollY = window.scrollY;
      render(); // ⭐️ 로딩 UI 먼저 보여줌

      const nextPage = Math.floor(state.products.length / state.limit) + 1;

      const data = await getProducts({
        limit: state.limit,
        sort: state.sort,
        page: nextPage,
      });

      state.products = [...state.products, ...data.products];
      state.total = data.pagination.total;
      state.loading = false;
      isFetching = false;

      if (state.products.length >= state.total) {
        removeInfiniteScroll();
      } else {
        render();
      }
      window.scrollTo(0, prevScrollY);
    }
  };

  window.addEventListener("scroll", infiniteScrollHandler);
}
function removeInfiniteScroll() {
  if (infiniteScrollHandler) {
    window.scrollTo(0, 0); // 페이지 이동 시 스크롤 위치 초기화
    window.removeEventListener("scroll", infiniteScrollHandler);
    infiniteScrollHandler = null;
  }
}
// let isFetching = false;
// function setupInfiniteScroll() {
//   window.addEventListener("scroll", async () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching && !state.loading) {
//       isFetching = true;
//       state.loading = true;
//       const prevScrollY = window.scrollY; // 현재 스크롤 위치 저장
//       render();
//       const nextPage = Math.floor(state.products.length / state.limit) + 1;
//       const data = await getProducts({
//         limit: state.limit,
//         sort: state.sort,
//         page: nextPage, // <-- 페이지 단위 요청
//       });
//       state.products = [...state.products, ...data.products];
//       console.log("상품", state.products);
//       state.total = data.pagination.total;
//       state.loading = false;
//       isFetching = false;
//       console.log("무한 스크롤 데이터 로드 완료", {
//         nextPage,
//         totalProducts: state.products.length,
//         total: state.total,
//       });
//       if (state.products.length >= state.total) {
//         console.log("모든 상품을 불러왔습니다.");
//         window.removeEventListener("scroll", setupInfiniteScroll); // 무한 스크롤 이벤트 제거
//       } else {
//         //console.log("추가 상품 로드 완료, 현재 상품 수:", state.products.length);
//         render();
//       }
//       window.scrollTo(0, prevScrollY); // 이전 스크롤 위치로 복원
//     }
//   });
// }

// 검색 이벤트 설정
function searchProductsEvent() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
      console.log("검색어 입력:", searchInput.value);
      const query = searchInput.value;
      state.search = query; // 검색어 상태 업데이트

      history.pushState({}, "", makeUrl()); // URL 업데이트
      localStorage.setItem("search", query); // 검색어를 로컬 스토리지에 저장
      state.loading = true;

      render();

      const data = await getProducts({
        limit: state.limit,
        sort: state.sort,
        search: query, // ✅ 검색어 필터 적용
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      render();
    } else if (e.key === "Escape") {
      console.log("검색어 초기화");
      searchInput.value = "";
      state.loading = true;

      history.pushState({}, "", "/");

      const data = await getProducts({
        limit: state.limit,
        sort: state.sort,
      });

      state.products = data.products;
      state.total = data.pagination.total;
      state.loading = false;
      render();
    }
  });
}

function syncStateWithUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("limit")) state.limit = parseInt(params.get("limit"), 10);
  if (params.has("search")) state.search = params.get("search");
  if (params.has("sort")) state.sort = params.get("sort");
}

// 애플리케이션 시작
async function main() {
  syncStateWithUrl(); // URL 파라미터로 상태 동기화

  state.isFirstLoad = true;

  if (window.location.pathname === base) {
    setupInfiniteScroll();
    render();
    fetchAndRender();
  } else if (window.location.pathname.startsWith(`${base}product/`)) {
    //render();
    await PageRouter(); // 반드시 await!
  } else {
    PageRouter(); // 잘못된 경로일 경우 에러 페이지 렌더링
  }

  window.addEventListener("popstate", async () => {
    syncStateWithUrl();
    if (window.location.pathname === base) {
      state = {
        products: [],
        total: 0,
        limit: 20,
        sort: "price_asc",
        search: "",
        loading: false,
        page: 1,
        isFirstLoad: true,
        categories: [],
      };
      selectedCategory = {
        category1: "",
        category2: "",
      };
      setupInfiniteScroll();
      fetchAndRender();
    } else if (window.location.pathname.startsWith(`${base}product/`)) {
      removeInfiniteScroll();
      await PageRouter(); // 반드시 await!
    } else {
      removeInfiniteScroll();
      PageRouter(); // 잘못된 경로일 경우 에러 페이지 렌더링
    }
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
