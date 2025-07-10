import { renderRoute } from "./route.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  renderRoute();
  window.addEventListener("popstate", renderRoute);

  // 전역 이벤트 위임 (한 번만 등록)
  document.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      window.history.pushState({ productId }, "상품 상세", `/detail?productId=${productId}`);
      renderRoute();
    }
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
