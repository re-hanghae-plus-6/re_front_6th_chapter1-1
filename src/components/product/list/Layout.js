import Footer from "./Footer";
import Header from "./Header";

function Layout({ children, loading = false }) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ loading })}
      <main class="max-w-md mx-auto px-4 py-4">${children}</main>
      ${Footer()}
    </div>
  `;
}

export default Layout;
