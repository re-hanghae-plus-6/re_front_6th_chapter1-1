import { useQueryParam } from "../../hook/useRouter";
import Component from "../../lib/Component";
import { homeStore } from "../../store/homeStore";
import { findBreadcrumb } from "../../utils/findBreadcrumb";
import { getCurrentCategory } from "../../utils/getCurrentCatetory";

export default class Breadcrumb extends Component {
  setup() {}

  selectBreadcrumb() {
    const setQueryParam = useQueryParam();

    const resetButton = document.querySelector('[data-breadcrumb="reset"]');
    const categoryButtons = document.querySelectorAll('[data-breadcrumb="category"]');

    resetButton.addEventListener("click", () => {
      homeStore.setState({
        categories: {
          currentCategory: "",
        },
      });

      setQueryParam("category1", "");
      setQueryParam("category2", "");
    });

    categoryButtons.forEach((button) => {
      const { categoryList } = homeStore.getState().categories;

      button.addEventListener("click", () => {
        const selectedCategory = button.getAttribute("data-category");

        const breadcrumb = findBreadcrumb(categoryList, selectedCategory);
        const category1 = breadcrumb[0] || "";
        const category2 = breadcrumb[1] || "";

        homeStore.setState({
          categories: {
            currentCategory: selectedCategory,
          },
        });

        setQueryParam("category1", category1);
        setQueryParam("category2", category2);
      });
    });
  }

  setEvent() {
    this.selectBreadcrumb();
  }

  section(path) {
    return /* HTML */ `<span class="text-xs text-gray-500">&gt;</span>
      <button
        data-breadcrumb="category"
        data-category=${path}
        class="text-xs hover:text-blue-800 hover:underline"
      >
        ${path}
      </button>`;
  }

  template() {
    const {
      categories: { categoryList },
    } = homeStore.getState();
    const currentCategory = getCurrentCategory();
    const categoryBreadcrumb = findBreadcrumb(categoryList, currentCategory);

    return /* HTML */ `
      <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">
        전체
      </button>
      ${categoryBreadcrumb.map(this.section).join("")}
    `;
  }
}
