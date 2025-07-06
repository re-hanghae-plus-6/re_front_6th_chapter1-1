import Header from "./Header.js";
import Footer from "./Footer.js";

export default function MainLayout({ children, cartCount = 0, showBackButton = false, title = "상품 상세" }) {
  return /*html*/ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ cartCount, showBackButton, title })}
      
      <main class="max-w-md mx-auto px-4 py-4">
        ${children}
      </main>
      
      ${Footer()}
    </div>
  `;
}
