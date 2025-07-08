import { getCategories, getProducts } from "../api/productApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Filter from "../components/filter/filter";
import ProductList from "../components/product/ProductList";
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "../constants";
import useHomeStore, { homeStore } from "../store/homeStore";

export default function HomePage() {
  // TODO : homeStore 디버깅용 코드 제거

  const {
    products: { list, total },
  } = useHomeStore();
  console.log("homeStore: ", useHomeStore());

  componentHandler().init();

  return /* HTML */ `
    <div class="bg-gray-50">
      ${Header()}
      <main class="maxProductList-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        ${Filter()}
        <!-- 상품 목록 -->
        ${ProductList({
          products: list,
          total: total,
        })}
      </main>
      ${Footer()}
    </div>
  `;
}

function componentHandler() {
  const {
    categories: { categoryList, isCategoryLoading },
  } = useHomeStore();

  const init = () => {
    fetchCategories();
    fetchProducts();
  };

  const render = () => {};

  const fetchProducts = async () => {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      search: "",
      category1: "",
      category2: "",
      sort: DEFAULT_SORT,
    };

    const { products, pagination } = await getProducts(params);

    homeStore.setState({
      ...homeStore.getState(),
      products: {
        ...homeStore.getState().products,
        list: products,
        pagination,
      },
    });
  };

  const fetchCategories = async () => {
    if (isCategoryLoading || categoryList.length > 0) return;
    homeStore.setState({
      ...homeStore.getState(),
      categories: {
        ...homeStore.getState().categories,
        list: [],
        isLoading: true,
      },
    });

    const categories = await getCategories();

    homeStore.setState({
      ...homeStore.getState(),
      categories: {
        ...homeStore.getState().categories,
        list: categories,
        isLoading: false,
      },
    });
  };

  return { init, render, fetchProducts, fetchCategories };
}
