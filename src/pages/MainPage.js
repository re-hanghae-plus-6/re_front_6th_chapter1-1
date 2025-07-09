import { Layout } from "../components/layout/Layout.js";
import { Header } from "../components/layout/Header.js";
import { Body } from "../components/layout/Body.js";
import { Footer } from "../components/layout/Footer.js";
import { SearchFilter } from "../components/searchFilter/SearchFilter.js";
import { ProductList } from "../components/productList/ProductList.js";
import { fetchProducts } from "../entities/products.js";
import { productsStore } from "../store.js";

let isScrollEventBound = false;

function handleScroll() {
  const { pagination } = productsStore.state;
  if (!pagination.hasNext) {
    return;
  }

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (productsStore.state.isLoading) return;
    fetchProducts({
      ...pagination,
      page: pagination.page + 1,
    });
  }
  console.log("전체", productsStore.state.products);
}

export const MainPage = async () => {
  if (!isScrollEventBound) {
    window.addEventListener("scroll", handleScroll);
    isScrollEventBound = true;
  }

  return Layout(Header() + Body(SearchFilter(), ProductList()) + Footer());
};
