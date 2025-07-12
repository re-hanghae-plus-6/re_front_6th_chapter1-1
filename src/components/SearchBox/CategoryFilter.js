import stateManager from "../../state/index.js";

class CategoryFilter {
  constructor() {
    this.categories = [];
    this.currentCategory1 = "";
    this.currentCategory2 = "";
    this.loadingCategories = true;

    // 상태에서 현재 카테고리 정보 읽기
    this.syncCategoryFromState();

    // 카테고리 상태 변경 구독
    this.setupSubscriptions();
  }

  /**
   * 상태 구독 설정
   */
  setupSubscriptions() {
    stateManager.productList.subscribe("category", () => {
      this.syncCategoryFromState();
    });
  }

  /**
   * 상태에서 카테고리 정보 동기화
   */
  syncCategoryFromState() {
    const category = stateManager.productList.state.category;
    if (category) {
      const [category1, category2] = category.split(">").map((c) => c.trim());
      this.currentCategory1 = category1 || "";
      this.currentCategory2 = category2 || "";
    } else {
      this.currentCategory1 = "";
      this.currentCategory2 = "";
    }

    // 상태 변경 시 DOM 업데이트 (DOM이 존재할 때만)
    if (document.getElementById("category-list")) {
      this.updateCategoryListDOM();
      this.updateBreadcrumbDOM();
    }
  }

  /**
   * 카테고리 데이터 로드 (단일 책임: 데이터 로딩만)
   */
  async loadCategories() {
    try {
      this.loadingCategories = true;

      // Mock API 호출
      const response = await fetch("/api/categories");
      const data = await response.json();

      // API 응답을 CategoryFilter가 사용할 수 있는 형태로 변환
      this.categories = this.transformCategoriesData(data);
      this.loadingCategories = false;
    } catch (error) {
      console.error("카테고리 로드 실패:", error);
      this.loadingCategories = false;
    }
  }

  /**
   * API에서 받은 카테고리 데이터를 컴포넌트에서 사용할 형태로 변환
   * @param {Object} categoriesData - API에서 받은 카테고리 객체
   * @returns {Array} 변환된 카테고리 배열
   */
  transformCategoriesData(categoriesData) {
    const categories = [];

    Object.keys(categoriesData).forEach((category1Name) => {
      const subCategoriesObj = categoriesData[category1Name];
      const subCategories = Object.keys(subCategoriesObj).map((category2Name) => ({
        name: category2Name,
      }));

      categories.push({
        name: category1Name,
        subCategories: subCategories,
      });
    });

    return categories;
  }

  /**
   * 브레드크럼 클릭 이벤트 처리
   */
  handleBreadcrumbClick = (e) => {
    const action = e.target.getAttribute("data-action");

    if (action === "reset") {
      // 전체 카테고리로 이동
      stateManager.productList.applyFilters({ category: "" });
    } else if (action === "category1") {
      // 1차 카테고리로 이동 (2차 카테고리 제거)
      stateManager.productList.applyFilters({ category: this.currentCategory1 });
    }
  };

  /**
   * 카테고리 클릭 이벤트 처리
   */
  handleCategoryClick = (e) => {
    const category1 = e.target.getAttribute("data-category1");
    const category2 = e.target.getAttribute("data-category2");

    if (category2) {
      // 2차 카테고리 선택
      const category = `${category1} > ${category2}`;
      stateManager.productList.applyFilters({ category });
    } else {
      // 1차 카테고리 선택
      stateManager.productList.applyFilters({ category: category1 });
    }
  };

  /**
   * 컴포넌트 마운트 시 초기화
   */
  async mounted() {
    await this.loadCategories(); // 1. 카테고리 데이터 로드
    this.updateDOM(); // 2. DOM 업데이트
    this.attachEvents(); // 3. 이벤트 리스너 연결 (DOM 준비 후)
  }

  /**
   * DOM 업데이트트
   */
  updateDOM() {
    this.updateCategoryListDOM();
    this.updateBreadcrumbDOM();
  }

  /**
   * DOM 이벤트 리스너 연결
   */
  attachEvents() {
    // 브레드크럼 이벤트
    const breadcrumb = document.getElementById("category-breadcrumb");
    if (breadcrumb) {
      breadcrumb.addEventListener("click", this.handleBreadcrumbClick);
    }

    // 카테고리 버튼들에 직접 이벤트 연결
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((button) => {
      button.addEventListener("click", this.handleCategoryClick);
    });
  }

  /**
   * 브레드크럼 렌더링
   */
  renderBreadcrumb() {
    const breadcrumbs = ["전체"];

    if (this.currentCategory1) {
      breadcrumbs.push(this.currentCategory1);
    }

    if (this.currentCategory2) {
      breadcrumbs.push(this.currentCategory2);
    }

    return breadcrumbs
      .map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isClickable = !isLast;

        let action = "";
        if (crumb === "전체") action = "reset";
        else if (index === 1) action = "category1";

        return /*html*/ `
        <span class="${isClickable ? "cursor-pointer hover:text-blue-600" : "text-gray-500"}"
              ${isClickable ? `data-action="${action}"` : ""}>
          ${crumb}
        </span>
      `;
      })
      .join(' <span class="text-gray-400">></span> ');
  }

  /**
   * 카테고리 목록 렌더링
   */
  renderCategories() {
    if (this.loadingCategories) {
      return '<div class="text-center py-4 text-gray-500">카테고리 로딩 중...</div>';
    }

    if (!this.currentCategory1) {
      // 1차 카테고리 목록 표시
      return this.categories
        .map(
          (category) => /*html*/ `
        <button class="category-btn px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                data-category1="${category.name}">
          ${category.name}
        </button>
      `,
        )
        .join("");
    } else {
      // 2차 카테고리 목록 표시
      const selectedCategory = this.categories.find((cat) => cat.name === this.currentCategory1);
      if (selectedCategory?.subCategories) {
        return selectedCategory.subCategories
          .map(
            (subCategory) => /*html*/ `
          <button class="category-btn px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors ${
            subCategory.name === this.currentCategory2 ? "bg-blue-100 border-blue-300" : ""
          }"
                  data-category1="${this.currentCategory1}"
                  data-category2="${subCategory.name}">
            ${subCategory.name}
          </button>
        `,
          )
          .join("");
      }
      return '<div class="text-center py-4 text-gray-500">하위 카테고리가 없습니다.</div>';
    }
  }

  /**
   * 카테고리 목록 DOM을 직접 업데이트
   */
  updateCategoryListDOM() {
    const categoryListElement = document.getElementById("category-list");
    if (categoryListElement) {
      categoryListElement.innerHTML = this.renderCategories();
      // DOM 업데이트 후 이벤트 다시 연결
      const categoryButtons = document.querySelectorAll(".category-btn");
      categoryButtons.forEach((button) => {
        button.addEventListener("click", this.handleCategoryClick);
      });
    }
  }

  /**
   * 브레드크럼 DOM을 직접 업데이트
   */
  updateBreadcrumbDOM() {
    const breadcrumbElement = document.getElementById("category-breadcrumb");
    if (breadcrumbElement) {
      breadcrumbElement.innerHTML = this.renderBreadcrumb();
    }
  }

  render() {
    return /*html*/ `
      <div class="mb-4">
        <!-- 브레드크럼 -->
        <div class="text-sm text-gray-600 mb-2">
          카테고리: <span id="category-breadcrumb">${this.renderBreadcrumb()}</span>
        </div>
        
        <!-- 카테고리 목록 -->
        <div class="flex flex-wrap gap-2" id="category-list">
          ${this.renderCategories()}
        </div>
      </div>
    `;
  }
}

export default CategoryFilter;
