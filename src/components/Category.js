import Component from "../core/component";
import { getCategories } from "../api/productApi";
// import { getProductParams } from "../pages/Main";

class Category extends Component {
  async setup() {
    this.state = {
      isLoading: true,
      category1: null,
    };

    const categoryList = await getCategories();
    const oneDepth = categoryList ? Object.keys(categoryList) : [];

    const category1Children = oneDepth?.reduce((acc, category, index) => {
      acc[`category1_${index}`] = {
        component: Category1Button,
        props: { name1: category },
      };

      return acc;
    }, {});

    this.children = {
      ...category1Children,
    };

    this.setState({
      isLoading: false,
      category1: oneDepth,
    });
  }

  template() {
    const isLoading = this.state?.isLoading;
    const category1List = this.state?.category1 ?? [];
    const category1 = 1;
    const category2 = 1;

    return `      
			<div id="category-select" class="space-y-2">
				<div class="breadcrumb-container flex items-center gap-2">
					<label class="text-sm text-gray-600">카테고리:</label>
					<button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
					${category1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1=${category1} class="text-xs hover:text-blue-800 hover:underline">${category1}</button>` : ""}
					${category2 ? `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${category2}</span>` : ""}
				</div>

				<div class="flex flex-wrap gap-2">
					${
            isLoading
              ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
              : `${category1List.map((_, index) => this.createBoxlessContainer(`category1_${index}`)).join("\n")}`
          }
				</div>
			</div>
		`;
  }

  setEvent() {}
}

class Category1Button extends Component {
  template() {
    const name1 = this.props?.name1 ?? "";
    return `
      <button
        data-category1=${name1}
        class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        ${name1}
      </button>
    `;
  }
}

// class Category2Button extends Component {
//   template() {
//     const name1 = this.props?.name1 ?? "";
//     const name2 = this.props?.name2 ?? "";

//     const productParams = getProductParams();
//     console.log(productParams());
//     const isSelected = productParams?.category2 === name2;

//     const defaultColor = `bg-white border-gray-300 text-gray-700 hover:bg-gray-50`;
//     const selectedColor = `bg-blue-100 border-blue-300 text-blue-800`;

//     return `
//       <button
//         data-category1=${name1}
//         data-category2=${name2}
//         class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${isSelected ? selectedColor : defaultColor}"
//       >
//         ${name2}
//       </button>
//     `;
//   }
// }

export default Category;
