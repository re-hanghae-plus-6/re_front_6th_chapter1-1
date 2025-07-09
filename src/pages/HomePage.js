import { getCategories } from "../api/productApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Filter from "../components/filter/FilterSection";
import ProductList from "../components/product/ProductList";
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
    const { isCategoryLoading, categoryList } = homeState.categories;

    // categoryList가 객체이고 키가 있거나, 이미 로딩 중이면 리턴
    const hasCategories =
      categoryList &&
      (Array.isArray(categoryList)
        ? categoryList.length > 0
        : Object.keys(categoryList).length > 0);
    if (hasCategories || isCategoryLoading) return;

    homeStore.setState({
      categories: {
        ...homeState.categories,
        isCategoryLoading: true,
      },
    });

    const categories = await getCategories();

    homeStore.setState({
      categories: {
        categoryList: categories,
        isCategoryLoading: false,
      },
    });
  }

  mounted() {
    const filterContainer = document.querySelector("#filter-container");
    const productListContainer = document.querySelector("#product-list-container");

    if (!this.child.get("filter")) {
      const filterInstance = new Filter(filterContainer);
      this.addChild(filterInstance, "filter");
    } else {
      const filterInstance = this.child.get("filter");
      filterInstance.$target = filterContainer;
      filterInstance.render();
    }

    if (!this.child.get("productList")) {
      const productListInstance = new ProductList(productListContainer);
      this.addChild(productListInstance, "productList");
    } else {
      const productListInstance = this.child.get("productList");
      productListInstance.$target = productListContainer;
      productListInstance.render();
    }
  }

  template() {
    return /* HTML */ `
      <div class="bg-gray-50">
        ${Header()}
        <main class="maxProductList-w-md mx-auto px-4 py-4">
          <!-- 검색 및 필터 -->
          <div id="filter-container"></div>

          <!-- 상품 목록 -->
          <div class="mb-6" id="product-list-container"></div>
        </main>
        ${Footer()}
      </div>
    `;
  }
}
