import { getCategories } from "../api/productApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Filter from "../components/filter/filter";
import Component from "../lib/Component";

import { homeStore } from "../store/homeStore";

export default class HomePage extends Component {
  setup() {
    this.unsubscribe = homeStore.subscribe(() => {
      this.render();
      this.setEvent();
      this.mounted();
    });

    this.fetchCategories();
  }

  async fetchCategories() {
    const homeState = homeStore.getState();

    const hasCategories = homeState.categories.categoryList.length > 0;
    if (hasCategories) return;

    homeStore.setState({
      ...homeState,
      categories: {
        ...homeState.categories,
        isCategoryLoading: true,
      },
    });

    const categories = await getCategories();

    homeStore.setState({
      ...homeState,
      categories: {
        ...homeState.categories,
        categoryList: categories,
        isCategoryLoading: false,
      },
    });
  }

  mounted() {
    const filterContainer = document.querySelector("#filter-container");
    new Filter(filterContainer);

    // const productListContainer = document.querySelector("#product-list-container");
    // new ProductList(productListContainer);
  }

  template() {
    return /* HTML */ `
      <div class="bg-gray-50">
        ${Header()}
        <main class="maxProductList-w-md mx-auto px-4 py-4">
          <!-- 검색 및 필터 -->
          <div id="filter-container" />

          <!-- 상품 목록 -->
          <div id="product-list-container" />
        </main>
        ${Footer()}
      </div>
    `;
  }
}
