import mainStore from "../core/store/mainStore";
import { getProducts, getCategories } from "../api/productApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";

export const getProductParams = () => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  return {
    ...(searchParams.get("page") && { page: searchParams.get("page") }),
    ...(searchParams.get("limit") && { limit: searchParams.get("limit") }),
    ...(searchParams.get("search") && { search: searchParams.get("search") }),
    ...(searchParams.get("category1") && { category1: searchParams.get("category1") }),
    ...(searchParams.get("category2") && { category2: searchParams.get("category2") }),
    ...(searchParams.get("sort") && { sort: searchParams.get("sort") }),
  };
};

const MainPage = () => {
  const root = document.body.querySelector("#root");

  const render = () => {
    const { isLoading, categoriesData, productsData } = mainStore.getState();

    root.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        ${Header()}
        <main class="max-w-md mx-auto px-4 py-4">
        ${Filter({ isLoading, categoriesData })}
        ${ProductList({ isLoading, productsData })}
        </main>
        ${Footer()}
      </div>
    `;

    document.querySelector("#limit-select").addEventListener("change", (e) => {
      const value = e.target.value;

      const url = new URL(window.location.href);
      url.searchParams.set("limit", value);
      history.pushState(null, "", url.toString());

      fetch();
    });

    document.querySelector("#sort-select").addEventListener("change", (e) => {
      const value = e.target.value;

      const url = new URL(window.location.href);
      url.searchParams.set("sort", value);
      history.pushState(null, "", url.toString());

      fetch();
    });
  };

  const fetch = async () => {
    mainStore.setState({
      isLoading: true,
    });

    const [productsData, categoriesData] = await Promise.all([getProducts(getProductParams()), getCategories()]);

    mainStore.setState({
      productsData,
      categoriesData,
      isLoading: false,
    });
  };

  fetch();
  render();

  const unsubscribe = mainStore.subscribe(render);

  return () => unsubscribe();
};

export default MainPage;
