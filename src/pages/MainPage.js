import Component from "../core/component";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";

class MainPage extends Component {
  setup() {
    this.children = {
      header: {
        component: Header,
      },
      footer: {
        component: Footer,
      },
      filter: {
        component: Filter,
      },
      productList: {
        component: ProductList,
      },
    };
  }

  template() {
    return `
      <div class="min-h-screen bg-gray-50">
        ${this.createBoxlessContainer("header")}
        <main class="max-w-md mx-auto px-4 py-4">
        ${this.createBoxlessContainer("filter")}
        ${this.createBoxlessContainer("productList")}
        </main>
        ${this.createBoxlessContainer("footer")}
      </div>
    `;
  }
}

export default MainPage;
