import { getProducts } from "../api/productApi";
import { DEFAULT_LIMIT, relatedProductsStore } from "../store";

export const fetchRelatedProducts = async (params) => {
  const mergedParams = {
    page: 1,
    limit: DEFAULT_LIMIT,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
    ...params,
  };

  relatedProductsStore.setState({ isLoading: true, error: null });
  try {
    const products = await getProducts(mergedParams);
    console.log("fetchProducts", products);
    if (params.page === 1 || params.page === undefined) {
      relatedProductsStore.setState({ ...products, isLoading: false });
    } else {
      relatedProductsStore.setState({
        ...relatedProductsStore.state,
        ...products,
        products: [...relatedProductsStore.state.products, ...products.products],
        isLoading: false,
      });
    }
  } catch (error) {
    console.error(error);
    relatedProductsStore.setState({ error: "관련상품목록 조회 에러", isLoading: false });
  }
};
