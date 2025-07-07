import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = (content) => /* html */ `
<div class="min-h-screen bg-gray-50">
  ${Navbar()}
  <main>${content}</main>
  ${Footer()}
</div>
`;
