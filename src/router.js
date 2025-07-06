import ProductDetailPage from "./pages/ProductDetailPage.js";
import { fetchProductsAndRender, renderHome } from "./state.js";

// URL → 화면
export async function router() {
  const match = location.pathname.match(/^\/product\/(\w+)/);
  if (match) {
    await ProductDetailPage(match[1]);
  } else {
    // 홈
    await fetchProductsAndRender();
    renderHome();
  }
}

// 링크 처리
export function handleLinkClicks(e) {
  const a = e.target.closest("[data-link]");
  if (!a) return;
  e.preventDefault();
  history.pushState(null, "", a.href);
  router();
}
