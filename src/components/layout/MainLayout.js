import Header from "./Header.js";
import Footer from "./Footer.js";

export default function MainLayout({ content, cartCount = 0, showBackButton = false, title = "쇼핑몰" }) {
  return `
        <div class="min-h-screen bg-gray-50">
            ${Header({ cartCount, title, showBackButton })}
            <main class="max-w-md mx-auto px-4 py-4">
                ${content}
            </main>
            ${Footer()}
        </div>
    `;
}
