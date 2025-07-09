import { getProducts } from "../api/productApi";
import Loading from "../components/Loading";
import ProductList from "../components/ProductList";
import Search from "../components/Search";
import useRender from "../core/useRender";

const state = {
  isLoading: true,
};

const fetchProducts = async () => {
  const data = await getProducts();
  state.isLoading = false;
  return {
    products: data.products,
    pagination: data.pagination,
  };
};

Home.mount = async () => {
  const render = useRender();
  const { products, pagination } = await fetchProducts();

  render.draw("main", Home({ products, pagination }));
};

export default function Home({ products, pagination }) {
  return /* html */ `
    ${Search()}
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        <!-- 상품 그리드 -->
        ${state.isLoading ? Loading({ type: "products" }) : ProductList(products, pagination)}
      </div>
    </div>
  `;
}
