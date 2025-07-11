import Loading from "./Loading.js";
import { getProducts } from "../api/productApi.js";
import ProductList from "./ProductList.js";
import Header from "./Header.js";
import Filter from "./Filter.js";
import Footer from "./Footer.js";

export default function Home({ $target }) {
  this.state = {
    isLoading: true,
    products: [],
  };
  const render = () => {
    $target.innerHTML = "";
    if (this.state.isLoading) {
      $target.appendChild(Loading());
      return;
    }
    const $mainDiv = document.createElement("div");
    $mainDiv.className = "bg-gray-50";
    $mainDiv.appendChild(Header());
    const $main = document.createElement("main");
    $main.className = "max-w-md mx-auto px-4 py-4";
    $main.appendChild(Filter());
    const $productList = ProductList({ products: this.state.products });
    $main.appendChild($productList);
    $main.appendChild(Footer());
    $mainDiv.appendChild($main);
    $target.appendChild($mainDiv);
  };
  this.setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    render();
  };
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      this.setState({ isLoading: false, products: data.products });
      console.log("data", data);
    } catch (e) {
      console.log("error occurred");
    }
  };
  render();
  fetchProducts();
}
