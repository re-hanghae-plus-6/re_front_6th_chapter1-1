import { getProducts } from "../api/productApi";
import { DEFAULT_LIMIT, productsStore } from "../store";

export const fetchProducts = async (params) => {
  const mergedParams = {
    page: 1,
    limit: DEFAULT_LIMIT,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
    ...params,
  };

  productsStore.setState({ isLoading: true, error: null });
  try {
    const products = await getProducts(mergedParams);
    console.log("fetchProducts", products);
    if (params.page === 1 || params.page === undefined) {
      productsStore.setState({ ...products, isLoading: false });
    } else {
      productsStore.setState({
        ...productsStore.state,
        ...products,
        products: [...productsStore.state.products, ...products.products],
        isLoading: false,
      });
    }
  } catch (error) {
    console.error(error);
    productsStore.setState({ error: "상품목록 조회 에러", isLoading: false });
  }
};
