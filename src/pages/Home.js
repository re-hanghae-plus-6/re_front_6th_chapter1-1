import { getCategories, getProducts } from "../api/productApi";
import Loading from "../components/Loading";
import ProductList from "../components/ProductList";
import Search from "../components/Search";
import useNavigate from "../core/useNavigate";
import useRender from "../core/useRender";
import useStore from "../core/useStore";

const store = useStore();
const navigate = useNavigate();
const state = {
  isLoading: true,
};

const fetchProducts = async (params = {}) => {
  state.isLoading = true;
  const productData = await getProducts(params);
  const categoriesData = await getCategories();
  state.isLoading = false;
  return {
    products: productData.products,
    pagination: productData.pagination,
    categories: categoriesData,
  };
};

Home.mount = async () => {
  const render = useRender();
  const { products, pagination, categories } = await fetchProducts();

  render.draw("main", Home({ products, pagination, isLoading: state.isLoading, categories }));
  Search.mount();

  store.watch(async (newValue) => {
    const url = new URL(window.location);
    Object.entries(newValue).forEach(([key, value]) => {
      if (value !== "" && value) {
        url.searchParams.set(key, value);
      }
    });
    navigate.push({}, url.toString());

    const { products } = await fetchProducts(newValue);
    console.log(products, "prod");
    // 화면을 다시 그리기 위해서 아래 함수를 실행시키면 딱 한 번만 검색이 되고, 두 번째부터는 먹히지 않음
    // TODO :: 상품 검색 수정
    // render.draw("main", Home({ products, pagination, categories }));
  }, "params");
};

export default function Home({ products, pagination, isLoading, categories }) {
  console.log(products);
  return /* html */ `
    ${Search(categories, isLoading)}
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        <!-- 상품 그리드 -->
        ${state.isLoading ? Loading({ type: "products" }) : ProductList(products, pagination)}
      </div>
    </div>
  `;
}
