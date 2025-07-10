import { Body } from "../components/layout/Body";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";

export const ProductPage = async () => {
  return Layout(Header("ProductPage") + Body() + Footer());
};
