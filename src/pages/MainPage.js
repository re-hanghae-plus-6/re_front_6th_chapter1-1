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
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (productsStore.state.isLoading) return;
    fetchProducts({
      ...productsStore.state.pagination,
      page: productsStore.state.pagination.page + 1,
    });
  }
  console.log("전체", productsStore.state.products);
}

export const MainPage = async () => {
<<<<<<< HEAD
  if (!isScrollEventBound) {
    window.addEventListener("scroll", handleScroll);
    isScrollEventBound = true;
  }

=======
>>>>>>> 91f244e (feat : product store구현 완료)
  return Layout(Header() + Body(SearchFilter(), ProductList()) + Footer());
};
