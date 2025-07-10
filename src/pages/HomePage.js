import { getCategories } from "../api/productApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Filter from "../components/filter/FilterSection";
import ProductList from "../components/product/ProductList";
import Component from "../lib/Component";

import { homeStore } from "../store/homeStore";

const CHILD_COMPONENT = {
  HEADER: "header",
  FILTER: "filter",
  PRODUCT_LIST: "productList",
};

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
    const $filterContainer = document.querySelector("#filter-container");
    const $productListContainer = document.querySelector("#product-list-container");
    const $headerContainer = document.querySelector("#header-container");

    if (!this.child.get(CHILD_COMPONENT.HEADER)) {
      const headerInstance = new Header($headerContainer);
      this.addChild(headerInstance, CHILD_COMPONENT.HEADER);
    } else {
      const headerInstance = this.child.get(CHILD_COMPONENT.HEADER);
      headerInstance.$target = $headerContainer;
      headerInstance.render();
    }

    if (!this.child.get(CHILD_COMPONENT.FILTER)) {
      const filterInstance = new Filter($filterContainer);
      this.addChild(filterInstance, CHILD_COMPONENT.FILTER);
    } else {
      const filterInstance = this.child.get(CHILD_COMPONENT.FILTER);
      filterInstance.$target = $filterContainer;
      filterInstance.render();
    }

    if (!this.child.get(CHILD_COMPONENT.PRODUCT_LIST)) {
      const productListInstance = new ProductList($productListContainer);
      this.addChild(productListInstance, CHILD_COMPONENT.PRODUCT_LIST);
    } else {
      const productListInstance = this.child.get(CHILD_COMPONENT.PRODUCT_LIST);
      productListInstance.$target = $productListContainer;
      productListInstance.render();
    }
  }

  template() {
    return /* HTML */ `
      <div class="bg-gray-50">
        <div id="header-container"></div>

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
