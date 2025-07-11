import Footer from "./Footer.js";
import Header from "./Header.js";

export function Layout({ pageComponent, isDetailPage = false }) {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">${Header({ isDetail: isDetailPage })} ${pageComponent()} ${Footer()}</div>
  `;
}
