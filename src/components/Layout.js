import { render } from "../main";
import Footer from "./footer";
import Header from "./Header";

Layout.mount = () => {
  console.log("test");
  render.draw("#header", Header());
  render.draw("#footer", Footer());
};

export default function Layout() {
  return /* html */ `
    <div class="min-h-screen bg-gray-50">
      <header id="header" class="bg-white shadow-sm sticky top-0 z-40"></header>
      <main id="main" class="max-w-md mx-auto px-4 py-4"></main>
      <footer id="footer"></footer>
    </div>
  `;
}
