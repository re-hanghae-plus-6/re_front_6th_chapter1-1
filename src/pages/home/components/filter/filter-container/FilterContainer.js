import Component from '../../../../../core/Component.js';

class FilterContainer extends Component {
  constructor(element, props) {
    super(element, props);
    this.state = {
      search: this.props.query.search,
    };
  }

  onMount() {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.props.loading) {
            this.props.onFetchNextPageProducts();
          }
        }
      });
    });

    const $footer = document.querySelector('#footer');
    observer.observe($footer);
  }

  attachEventListeners() {
    this.addEventListener(this.element, 'change', (event) => {
      const value = event.target.value;
      if (event.target.id === 'limit-select') {
        this.props.onChangeLimit(value);
      }

      if (event.target.id === 'sort-select') {
        this.props.onChangeSort(value);
      }
    });

    this.addEventListener(this.element, 'input', (event) => {
      const value = event.target.value;
      if (event.target.id === 'search-input') {
        this.state = {
          ...this.state,
          search: value,
        };
      }
    });

    this.addEventListener(this.element, 'keydown', (event) => {
      if (event.target.id === 'search-input' && event.key === 'Enter') {
        this.props.onChangeSearch(this.state.search);
      }
    });

    this.addEventListener(this.element, 'click', (event) => {
      if (event.target.classList.contains('category2-filter-btn')) {
        const category1 = event.target.dataset.category1;
        const category2 = event.target.dataset.category2 ? event.target.dataset.category2 : '';
        this.props.onChangeCategory(category1, category2);
      }

      if (event.target.dataset.breadcrumb) {
        const breadcrumb =
          event.target.dataset.breadcrumb === 'reset' ? '' : event.target.dataset.breadcrumb;
        this.props.onChangeCategory(breadcrumb, '');
      }
    });
  }

  renderBreadcrumb() {
    return /* HTML */ `
      ${this.props.query.category1
        ? /* HTML */ `
            <span class="text-xs text-gray-500">&gt;</span
            ><button
              data-breadcrumb="${this.props.query.category1}"
              data-category1="${this.props.query.category1}"
              class="text-xs hover:text-blue-800 hover:underline"
            >
              ${this.props.query.category1}
            </button>
          `
        : ''}
      ${this.props.query.category2
        ? /* HTML */ `
            <span class="text-xs text-gray-500">&gt;</span
            ><span class="text-xs text-gray-600 cursor-default">${this.props.query.category2}</span>
          `
        : ''}
    `;
  }

  renderCategories() {
    if (this.props.loading) {
      return '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>';
    }

    const category1List = Object.keys(this.props.categories);
    const category2List =
      this.props.query.category1 && this.props.categories[this.props.query.category1]
        ? Object.keys(this.props.categories[this.props.query.category1])
        : null;
    const isDefaultClass =
      'category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    const isActiveClass =
      'category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-blue-100 border-blue-300 text-blue-800';

    // 2뎁스가 있으면 2뎁스만 반환, 아니면 1뎁스만 반환
    if (category2List) {
      return /* HTML */ `
        <div class="flex flex-wrap gap-2">
          ${category2List
            .map(
              (subcategory) => /* HTML */ `
                <button
                  data-category1="${this.props.query.category1}"
                  data-category2="${subcategory}"
                  class="${subcategory === this.props.query.category2
                    ? isActiveClass
                    : isDefaultClass} "
                >
                  ${subcategory}
                </button>
              `,
            )
            .join('')}
        </div>
      `;
    } else {
      return /* HTML */ `
        <div class="flex flex-wrap gap-2">
          ${category1List
            .map(
              (category) => /* HTML */ `
                <button
                  data-category1="${category}"
                  class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  ${category}
                </button>
              `,
            )
            .join('')}
        </div>
      `;
    }
  }

  render() {
    this.element.innerHTML = /* HTML */ `
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <input
              type="text"
              id="search-input"
              placeholder="상품명을 검색해보세요..."
              value="${this.state.search}"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">카테고리:</label>
              <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">
                전체
              </button>
              ${this.renderBreadcrumb()}
            </div>
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">${this.renderCategories()}</div>
            <!-- 2depth 카테고리 -->
          </div>
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">개수:</label>
              <select
                id="limit-select"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10" ${this.props.query.limit === 10 ? 'selected' : ''}>10개</option>
                <option value="20" ${this.props.query.limit === 20 ? 'selected' : ''}>20개</option>
                <option value="50" ${this.props.query.limit === 50 ? 'selected' : ''}>50개</option>
                <option value="100" ${this.props.query.limit === 100 ? 'selected' : ''}>
                  100개
                </option>
              </select>
            </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">정렬:</label>
              <select
                id="sort-select"
                class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option
                  value="price_asc"
                  ${this.props.query.sort === 'price_asc' ? 'selected' : ''}
                >
                  가격 낮은순
                </option>
                <option
                  value="price_desc"
                  ${this.props.query.sort === 'price_desc' ? 'selected' : ''}
                >
                  가격 높은순
                </option>
                <option value="name_asc" ${this.props.query.sort === 'name_asc' ? 'selected' : ''}>
                  이름순
                </option>
                <option
                  value="name_desc"
                  ${this.props.query.sort === 'name_desc' ? 'selected' : ''}
                >
                  이름 역순
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default FilterContainer;
