import Footer from "./shared/ui/footer";
import Header from "./shared/ui/Header";
import { ListPageController, updateListPageUI, createListPageContainer } from "./pages/ListPage";
import { cartStore } from "./shared/store/CartStore.js";

const enableMocking = () => {
  return import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );
};

function render() {
  const cartCount = cartStore.getCartCount();
  document.body.querySelector("#root").innerHTML = `
  <div class="bg-gray-50">
    ${Header(cartCount)}
    ${createListPageContainer()}
    ${Footer}
  </div>
  `;
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

async function main() {
  // 1. 초기 렌더링 (빈 컨테이너 생성)
  render();

  // 2. 장바구니 상태 변경 구독
  cartStore.subscribe((cartState) => {
    // Header만 다시 렌더링
    const headerElement = document.querySelector("header");
    if (headerElement) {
      headerElement.outerHTML = Header(cartState.totalCount);
    }
  });

  // 3. 장바구니 이벤트 리스너 등록
  initializeCartEvents();

  // 4. 컨트롤러 생성 및 데이터 로드
  const controller = new ListPageController();
  await controller.loadData((state) => {
    // 5. 상태 변경 시마다 UI 업데이트 (controller도 함께 전달)
    updateListPageUI(state, controller);
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
