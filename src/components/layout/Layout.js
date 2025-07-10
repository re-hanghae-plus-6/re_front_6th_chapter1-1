import { Header } from "./Header.js";
import { Footer } from "./Footer.js";

export const Layout = ({ children }) => {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">${children}</main>
      ${Footer()}
      <div id="modal-portal"></div>
    </div>
  `;
};
