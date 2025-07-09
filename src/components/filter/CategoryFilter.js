import { CategoriesModel } from "../../models/CategoriesModel.js";

export class CategoryFilter {
  constructor(container) {
    this.container = container;
    this.categoriesModel = new CategoriesModel();
    this.unsubscribe = null;
    this.selectedCategory1 = "";
    this.selectedCategory2 = "";
    this.onFilterChange = null;
  }

  async init(selectedCategory1 = "", selectedCategory2 = "", onFilterChange = null) {
    this.selectedCategory1 = selectedCategory1;
    this.selectedCategory2 = selectedCategory2;
    this.onFilterChange = onFilterChange;

    this.render({
      categories: [],
      loading: true,
    });

    this.unsubscribe = this.categoriesModel.subscribe((state) => {
      this.render(state);
    });

    await this.categoriesModel.fetchCategories();

    this.setupEventListeners();
  }

  render(state) {
    const { categories, loading } = state;

    this.container.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">카테고리:</label>
          <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
          ${this.selectedCategory1 ? `<span class="text-xs text-gray-500">&gt;</span><button data-breadcrumb="category1" data-category1="${this.selectedCategory1}" class="text-xs hover:text-blue-800 hover:underline">${this.selectedCategory1}</button>` : ""}
          ${this.selectedCategory2 ? `<span class="text-xs text-gray-500">&gt;</span><span class="text-xs text-gray-600 cursor-default">${this.selectedCategory2}</span>` : ""}
        </div>
        
        ${
          !this.selectedCategory1
            ? `
        <!-- 1depth 카테고리 -->
        <div class="flex flex-wrap gap-2">
          ${
            loading
              ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
              : categories.length > 0
                ? categories
                    .map(
                      (cat) => `
                    <button data-category1="${cat.name}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                      ${cat.name}
                    </button>
                  `,
                    )
                    .join("")
                : `<div class="text-sm text-gray-500 italic">카테고리를 불러올 수 없습니다</div>`
          }
        </div>
        `
            : ""
        }
        
        <!-- 2depth 카테고리 -->
        ${
          this.selectedCategory1 && categories.find((cat) => cat.name === this.selectedCategory1)?.subcategories
            ? `
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              ${categories
                .find((cat) => cat.name === this.selectedCategory1)
                ?.subcategories.map(
                  (subcat) => `
                <button data-category1="${this.selectedCategory1}" data-category2="${subcat}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   ${this.selectedCategory2 === subcat ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                  ${subcat}
                </button>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      if (e.target.matches(".category1-filter-btn")) {
        const category1 = e.target.dataset.category1;
        this.selectedCategory1 = category1;
        this.selectedCategory2 = "";
        this.onFilterChange?.({ category1, category2: "" });
      } else if (e.target.matches(".category2-filter-btn")) {
        const category1 = e.target.dataset.category1;
        const category2 = e.target.dataset.category2;
        this.selectedCategory1 = category1;
        this.selectedCategory2 = category2;
        this.onFilterChange?.({ category1, category2 });
      } else if (e.target.matches('[data-breadcrumb="reset"]')) {
        this.selectedCategory1 = "";
        this.selectedCategory2 = "";
        this.onFilterChange?.({ category1: "", category2: "" });
      } else if (e.target.matches('[data-breadcrumb="category1"]')) {
        const category1 = e.target.dataset.category1;
        this.selectedCategory1 = category1;
        this.selectedCategory2 = "";
        this.onFilterChange?.({ category1, category2: "" });
      }
    });
  }

  updateSelection(category1, category2) {
    this.selectedCategory1 = category1;
    this.selectedCategory2 = category2;
    // 현재 상태로 다시 렌더링
    const currentState = this.categoriesModel.getState();
    this.render(currentState);
  }

  updateValues(category1, category2) {
    this.selectedCategory1 = category1;
    this.selectedCategory2 = category2;
    // 현재 상태로 다시 렌더링
    const currentState = this.categoriesModel.getState();
    this.render(currentState);
    this.setupEventListeners();
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
