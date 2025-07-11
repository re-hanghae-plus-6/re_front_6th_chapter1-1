import Header from "./Header.js";
import Footer from "./Footer.js";

export default function MainLayout({ content, cartCount = 0 }) {
  return `
        <div class="min-h-screen bg-gray-50">
            ${Header({ cartCount })}
            <main class="max-w-md mx-auto px-4 py-4">
                ${content}
            </main>
            ${Footer()}
        </div>
    `;
}
