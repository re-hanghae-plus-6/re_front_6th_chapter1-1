import { Home } from "../pages/Home.js";
import { getProducts, getCategories } from "../api/productApi.js";

export class HomeController {
  constructor(container) {
    this.container = container;
  }

  async render() {
    const loadingHTML = Home({
      isLoading: true,
    });
    this.container.innerHTML = loadingHTML;

    const [productsResponse, categoriesResponse] = await Promise.all([getProducts(), getCategories()]);

    const products = productsResponse.products || [];
    const categories = categoriesResponse || [];
    const pagination = productsResponse.pagination || {};
    const filters = productsResponse.filters || {};

    const homeHTML = Home({
      products,
      categories,
      totalCount: pagination.total || 0,
      isLoading: false,
      hasMore: pagination.hasNext || false,
      selectedCategory1: filters.category1 || "",
      selectedCategory2: filters.category2 || "",
      searchQuery: filters.search || "",
      limit: pagination.limit || 20,
      sort: filters.sort || "price_asc",
    });

    this.container.innerHTML = homeHTML;
  }
}
