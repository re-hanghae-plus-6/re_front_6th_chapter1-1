import Header from "./Header.js";
import Footer from "./Footer.js";

export function Layout(page, cartCount = 0, isDetailPage = false) {
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${Header(cartCount, isDetailPage)}
        ${page()}
      ${Footer()}
    </div>
  `;
}
