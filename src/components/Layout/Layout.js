import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = (content) => /* html */ `
<div class="min-h-screen bg-gray-50">
  ${Navbar()}
  <main class="max-w-md mx-auto px-4 py-4">${content}</main>
  ${Footer()}
</div>
`;
