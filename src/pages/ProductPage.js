import { Body } from "../components/layout/Body";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";
import { ProductDetailBody } from "../components/productDetail/ProductDetailBody";

export const ProductPage = async () => {
  return Layout(Header("ProductPage") + Body(await ProductDetailBody()) + Footer());
};
