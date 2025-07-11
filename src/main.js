import Footer from "./shared/ui/footer";
import Header from "./shared/ui/Header";
import { ListPageController, updateListPageUI, createListPageContainer } from "./pages/ListPage";
import { DetailPageController, DetailPage } from "./pages/DetailPage";
import _404Page from "./pages/_404Page";
import { router } from "./shared/router";
import { cartStore } from "./shared/store/CartStore.js";

const enableMocking = () => {
  return import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );
};

// 현재 컨트롤러들
let listController = null;
let detailController = null;

function renderPage(content, isDetail = false) {
  const cartCount = cartStore.getCartCount();
  document.body.querySelector("#root").innerHTML = `
  <div class="bg-gray-50">
    ${Header({ cartCount, isDetail })}
    <div id="page-content">
      ${content}
    </div>
    ${Footer}
  </div>
  `;
}

// 페이지별 렌더링 함수들
function renderListPage() {
  renderPage(createListPageContainer());

  // ListPage 컨트롤러 초기화
  if (!listController) {
    listController = new ListPageController();
  }

  listController.loadData((state) => {
    updateListPageUI(state, listController);
  });
}

function renderDetailPage(params) {
  const productId = params.productId;

  // 로딩 상태로 먼저 렌더링 (isDetail: true 전달)
  renderPage(DetailPage({ loading: true }), true);

  // DetailPage 컨트롤러 초기화
  detailController = new DetailPageController();

  detailController.loadProductData(productId, (state) => {
    const content = DetailPage({
      product: state.product,
      relatedProducts: state.relatedProducts,
      loading: state.loading,
    });

    const pageContent = document.getElementById("page-content");
    if (pageContent) {
      pageContent.innerHTML = content;
    }

    // 상세 페이지 이벤트 리스너 초기화
    initializeDetailPageEvents();
  });
}

function render404Page() {
  renderPage(_404Page);
}

// 장바구니 담기 이벤트 리스너 등록
function initializeCartEvents() {
  // 이벤트 위임을 사용하여 동적으로 생성되는 버튼들도 처리
  document.addEventListener("click", (event) => {
    const target = event.target;

    // 장바구니 담기 버튼 클릭 처리
    if (target && target.classList.contains("add-to-cart-btn")) {
      event.preventDefault();

      const productCard = target.closest(".product-card");
      if (productCard) {
        const productId = productCard.getAttribute("data-product-id") || target.getAttribute("data-product-id");
        const title =
          productCard.querySelector("h3")?.textContent || productCard.querySelector("h1")?.textContent || "";
        const image = productCard.querySelector("img")?.src || "";
        const priceText = productCard.querySelector(".text-lg, .text-2xl")?.textContent || "0";
        const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;

        // 수량 입력이 있는 경우 (상세 페이지)
        const quantityInput = document.querySelector("#quantity-input");
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

        if (productId && title && price > 0) {
          cartStore.addItem({
            productId,
            title,
            image,
            price,
            quantity,
          });
        }
      }
    }
  });
}

// 상세 페이지 이벤트 리스너
function initializeDetailPageEvents() {
  // 상품 목록으로 돌아가기 버튼
  const goToListBtn = document.querySelector(".go-to-product-list");
  if (goToListBtn) {
    goToListBtn.addEventListener("click", (e) => {
      e.preventDefault();
      router.navigate("/");
    });
  }

  // 브레드크럼 링크
  const breadcrumbLinks = document.querySelectorAll(".breadcrumb-link");
  breadcrumbLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      router.navigate("/");
    });
  });

  // 관련 상품 클릭
  const relatedProductCards = document.querySelectorAll(".related-product-card");
  relatedProductCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = card.dataset.productId;
      if (productId) {
        router.navigate(`/product/${productId}`);
      }
    });
  });

  // 수량 조절 버튼
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");
  const quantityInput = document.getElementById("quantity-input");

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      const maxValue = parseInt(quantityInput.max);
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
      }
    });
  }
}

async function main() {
  // 1. 라우터 설정
  router.addRoute("/", renderListPage);
  router.addRoute("/product/:productId", renderDetailPage);
  router.addRoute("*", render404Page);

  // 라우터 초기화 (라우트 등록 후)
  router.init();

  // 2. 장바구니 상태 변경 구독
  cartStore.subscribe((cartState) => {
    // Header만 다시 렌더링
    const headerElement = document.querySelector("header");
    if (headerElement) {
      const isDetail = router.getCurrentRoute().startsWith("/product/");
      headerElement.outerHTML = Header({ cartCount: cartState.totalCount, isDetail });
    }
  });

  // 3. 장바구니 이벤트 리스너 등록
  initializeCartEvents();

  // 4. 링크 클릭 이벤트 위임 (SPA 네비게이션)
  document.addEventListener("click", (e) => {
    // data-link 속성이 있는 링크들은 SPA 방식으로 처리
    if (e.target.closest("[data-link]")) {
      e.preventDefault();
      const link = e.target.closest("[data-link]");
      const href = link.getAttribute("href") || "/";
      router.navigate(href);
    }

    // 상품 카드 클릭 (상품 이미지나 정보 영역)
    const productCard = e.target.closest(".product-card");
    if (productCard && (e.target.closest(".product-image") || e.target.closest(".product-info"))) {
      e.preventDefault();
      const productId = productCard.dataset.productId;
      if (productId) {
        router.navigate(`/product/${productId}`);
      }
    }
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
