import { Filter } from "../components/filter/Filter.js";
import { Layout } from "../components/layout/Layout.js";
import { ProductList } from "../components/product/ProductList.js";

export const Home = ({
  products = [],
  total = 0,
  isLoading = false,
  selectedLimit = "20",
  selectedSort = "price_asc",
  categories = {},
  search = "",
  cart = [],
}) => {
  const filterSection = Filter({ selectedLimit, selectedSort, categories, search, isLoading });
  const productSection = ProductList({ products, total, isLoading });

  return Layout({
    cart,
    children: `
      ${filterSection}
      ${productSection}
    `,
  });
};
