import NotFoundPage from "./pages/404.js";

let currentPageCleanup = null;

export async function renderRoute() {
  // 이전 페이지 정리
  if (currentPageCleanup) {
    currentPageCleanup();
    currentPageCleanup = null;
  }

  const path = window.location.pathname;
  const root = document.getElementById("root");

  if (path === "/list" || path === "/") {
    // "/" 접근 시 "/list"로 리다이렉트
    if (path === "/") {
      window.history.replaceState(null, "", "/list" + window.location.search);
    }
    // 리스트 페이지 렌더링 및 마운트
    const ListPage = await import("./pages/list.js").then((m) => m.default);
    root.innerHTML = ListPage({ isLoading: true });
    currentPageCleanup = ListPage.mount();
  } else if (path.startsWith("/detail/")) {
    // 상세 페이지 렌더링 및 마운트
    const DetailPage = await import("./pages/detail.js").then((m) => m.default);
    const productId = path.split("/")[2];
    root.innerHTML = DetailPage({ isLoading: true });
    currentPageCleanup = DetailPage.mount(productId);
  } else {
    // 404 페이지
    root.innerHTML = NotFoundPage();
  }
}
