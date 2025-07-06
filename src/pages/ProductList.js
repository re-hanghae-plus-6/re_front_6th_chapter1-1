import ProductFilter from "../components/product/ProductFilter";
import { loadProductList } from "../services/productLoader";
import { getProductListFilters } from "../utils/searchUtils";

export const ProductList = () => {
  ProductList.init = async () => {
    const query = getProductListFilters();
    await loadProductList(query);
  };

  return /* html */ `
    <main class="max-w-md mx-auto px-4 py-4">
      <div id="product-filter">${ProductFilter()}</div>
      <div id="products-grid"></div>
    </main>
  `;
};
