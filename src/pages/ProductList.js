import { loadCategories, loadProductList } from "../services/productLoader";
import { getProductListFilters } from "../utils/searchUtils";
import { ProductListLoading } from "../components/product/ProductLoading";

export const ProductList = () => {
  ProductList.init = async () => {
    const query = getProductListFilters();

    await loadCategories(query);
    await loadProductList(query);
  };

  return /* html */ `
    <main class="max-w-md mx-auto px-4 py-4">
      <div id="product-filter"></div>
      <div id="products-grid">${ProductListLoading()}</div>
    </main>
  `;
};
