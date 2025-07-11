import Footer from "../../common/Footer";
import Header from "./Header";

function DetailLayout({ children }) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ loading: true })}
      <main id="product-detail-content" class="max-w-md mx-auto px-4 py-4">${children}</main>
      ${Footer()}
    </div>
  `;
}

export default DetailLayout;
