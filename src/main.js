import { renderRoute } from "./route.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  renderRoute();

  // popstate 이벤트 시에도 이전 페이지 정리
  window.addEventListener("popstate", renderRoute);

  // 전역 이벤트 위임 (한 번만 등록)
  document.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      window.history.pushState({ productId }, "상품 상세", `/detail/${productId}`);
      renderRoute(); // 페이지 전환 시 이전 페이지 정리됨
    }
  });

  // 필터 이벤트들 전역 위임으로 처리
  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target.id === "limit-select") {
      const limit = target.value;
      window.dispatchEvent(new CustomEvent("changeLimit", { detail: { limit } }));
    }

    if (target.id === "sort-select") {
      const sort = target.value;
      window.dispatchEvent(new CustomEvent("changeSort", { detail: { sort } }));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.id === "search-input" && event.key === "Enter") {
      const search = event.target.value;
      window.dispatchEvent(new CustomEvent("changeSearch", { detail: { search } }));
    }
  });

  // 브라우저 종료 시 정리 (선택사항)
  window.addEventListener("beforeunload", () => {
    // 필요한 경우 마지막 정리 작업
  });
}
// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
