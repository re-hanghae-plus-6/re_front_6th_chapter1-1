import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = (content) => /* html */ `
  ${Navbar()}
  <main>${content}</main>
  ${Footer}
`;
