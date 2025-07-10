import { MainPage } from "../pages/MainPage.js";

export async function Router() {
  const path = window.location.pathname;
  if (path === "/" || path === "") {
    return await MainPage();
  }
  if (path === "/detail") {
    // TODO: 상품상세페이지 만들면 꼭 교체하기!
    return await MainPage();
  }

  return "<h1>404 Not Found</h1>";
}
