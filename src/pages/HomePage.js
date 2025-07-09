import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Filter from "../components/filter/filter";
import ProductList from "../components/product/ProductList";
import Component from "../lib/Component";
import { homeStore } from "../store/homeStore";

export default class HomePage extends Component {
  setup() {
    this.unsubscribe = homeStore.subscribe(() => {});
  }

  template() {
    const {
      products: { list, total },
    } = homeStore.getState();

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
}
