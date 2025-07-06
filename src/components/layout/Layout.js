import Header from "./Header.js";
import Footer from "./Footer.js";

export function Layout(pageComponent, cartCount = 0, isDetailPage = false) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">${Header(cartCount, isDetailPage)} ${pageComponent()} ${Footer()}</div>
  `;
}
