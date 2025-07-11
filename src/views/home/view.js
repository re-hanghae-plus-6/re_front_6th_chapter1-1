import BaseComponent from "@/core/component";

import { getProducts, getCategories } from "@/api/productApi";
import { HomePageViewModel } from "./view-model";

import { getSearchParams, updateSearchParams, navigateTo, getFullPath } from "@/core/router";
import { addToCart } from "@/store";
import { Toast } from "@/components";
import { clsx } from "clsx";

export default class HomePage extends BaseComponent {
  constructor(target) {
    super(target);

    // 토스트 컴포넌트 초기화
    this.toast = null;

    // 인터섹션 옵저버 초기화
    this.intersectionObserver = null;
    this.isLoadingMore = false; // 추가 로딩 상태 관리

    // 현재 입력 중인 검색어 저장 (form submit 전까지)
    this.currentSearchValue = "";
  }

  initialState() {
    // URL에서 읽어온 초기 상태 설정
    const initialState = this.getInitialStateFromURL();
    this.setState(initialState);
  }

  /**
   * URL에서 search params를 읽어와서 초기 상태를 설정
   */
  getInitialStateFromURL() {
    const urlParams = getSearchParams();
    const initialState = { ...HomePageViewModel.INITIAL_STATE };

    // URL 파라미터에서 필터 상태 읽기
    const search = urlParams.get("search");
    const sort = urlParams.get("sort");
    const limit = urlParams.get("limit");
    const category1 = urlParams.get("category1");
    const category2 = urlParams.get("category2");

    if (search) {
      initialState.filters.search = search;
    }

    if (sort && HomePageViewModel.SORT_OPTIONS.some((option) => option.value === sort)) {
      initialState.filters.sort = sort;
    }

    if (limit && HomePageViewModel.LIMIT_OPTIONS.includes(parseInt(limit))) {
      initialState.pagination.limit = parseInt(limit);
    }

    if (category1) {
      initialState.filters.category1 = category1;
    }
    if (category2) {
      initialState.filters.category2 = category2;
    }

    return initialState;
  }

  /**
   * 현재 상태를 기반으로 URL search params 업데이트
   */
  updateURLParams() {
    const params = {
      search: this.state.filters.search,
      sort: this.state.filters.sort,
      limit: this.state.pagination.limit,
      category1: this.state.filters.category1,
      category2: this.state.filters.category2,
    };

    updateSearchParams(params, {});
  }

  async componentDidMount() {
    await this.fetchAsyncData();
    this.initializeEventHandlers();
    this.initializeToast();
    this.setupIntersectionObserver(); // 인터섹션 옵저버 설정
    this.setupScrollListener(); // 스크롤 이벤트 리스너 설정
  }

  componentWillUnmount() {
    // 인터섹션 옵저버 정리
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // 스크롤 이벤트 리스너 정리
    if (this.handleScroll) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  initializeToast() {
    const toastContainer = document.getElementById("toast-container");
    if (toastContainer) {
      this.toast = new Toast(toastContainer);
    }
  }

  handleAddToCart(event) {
    event.preventDefault();

    const productId = event.target.dataset.productId;
    if (!productId) {
      console.error(HomePageViewModel.MESSAGES.ERROR_PRODUCT_ID);
      return;
    }

    const product = this.state.products.find((p) => p.productId === productId);
    if (!product) {
      console.error(HomePageViewModel.MESSAGES.ERROR_PRODUCT_INFO);
      return;
    }

    const cartItem = { id: product.productId, title: product.title, lprice: product.lprice, image: product.image };

    const success = addToCart(cartItem);

    if (success) {
      this.showAddToCartFeedback();
    }
  }

  /**
   * 장바구니 추가 성공 시 시각적 피드백
   */
  showAddToCartFeedback() {
    if (this.toast) {
      this.toast.show("success", HomePageViewModel.MESSAGES.CART_SUCCESS);
    }
  }

  handleChangeSearch(event) {
    // input 이벤트에서는 setState를 하지 않고, 단순히 입력값만 저장
    // form submit 시에만 실제로 state를 업데이트
    this.currentSearchValue = event.target.value;
  }

  handleFormSubmit(event) {
    event.preventDefault();

    // 현재 포커스된 요소가 검색 input인지 확인
    const shouldRestoreFocus = document.activeElement?.id === "search-input";

    // 검색어 state 업데이트
    const searchInput = this.target.querySelector("#search-input");
    const searchValue = searchInput ? searchInput.value : "";

    this.setState({ filters: { ...this.state.filters, search: searchValue } });

    // setState 후 포커스 복원
    if (shouldRestoreFocus) {
      setTimeout(() => {
        const searchInput = this.target.querySelector("#search-input");
        if (searchInput) {
          searchInput.focus();
          // 커서를 텍스트 끝으로 이동
          const length = searchInput.value.length;
          searchInput.setSelectionRange(length, length);
        }
      }, 0);
    }
  }

  handleChangeLimit(event) {
    this.setState({
      pagination: { ...this.state.pagination, limit: parseInt(event.target.value) },
    });
  }

  handleChangeSort(event) {
    this.setState({ filters: { ...this.state.filters, sort: event.target.value } });
  }

  handleProductCardClick(event) {
    const productCard = event.target.closest("#product-card");
    const productId = productCard.dataset.productId;
    if (!productId) {
      console.error("상품 ID를 찾을 수 없습니다.");
      return;
    }

    navigateTo(getFullPath(`/product/${productId}`));
  }

  handleCategoryFilter(event) {
    const { depth, category } = event.target.dataset;

    if (depth === "1") {
      this.setState({
        filters: { ...this.state.filters, category1: category },
      });
    } else if (depth === "2") {
      this.setState({
        filters: { ...this.state.filters, category2: category },
      });
    }
  }

  handleBreadCrumbClick(event) {
    const { breadcrumb } = event.target.dataset;

    if (breadcrumb === "reset") {
      this.setState({
        filters: { ...this.state.filters, category1: "", category2: "" },
      });
    } else if (breadcrumb === "category1") {
      this.setState({
        filters: { ...this.state.filters, category2: "" },
      });
    }
  }

  getStateChanges(prevState, nextState) {
    return {
      search: prevState.filters.search !== nextState.filters.search,
      sort: prevState.filters.sort !== nextState.filters.sort,
      category1: prevState.filters.category1 !== nextState.filters.category1,
      category2: prevState.filters.category2 !== nextState.filters.category2,
      limit: prevState.pagination.limit !== nextState.pagination.limit,
    };
  }

  needsDataRefresh(changes) {
    return changes.sort || changes.category1 || changes.category2 || changes.limit;
  }

  componentDidUpdate(_, prevState, nextState) {
    // 로딩 중일 때는 추가 요청 방지 (무한 루프 방지)
    if (nextState.loading) {
      return;
    }

    // 변경 사항 확인
    const stateChangeMap = this.getStateChanges(prevState, nextState);

    // 변경된 항목이 있으면 URL 업데이트
    if (Object.values(stateChangeMap).some(Boolean)) {
      this.updateURLParams();
    }

    // 검색어 외의 변경사항이 있으면 새로운 데이터 가져오기 (첫 페이지부터)
    const needsDataRefresh = this.needsDataRefresh(stateChangeMap);

    if (needsDataRefresh) {
      this.fetchAsyncData(true); // 필터 변경 시 첫 페이지부터 로드
    }

    // 검색어 변경 시에도 데이터 새로고침
    if (stateChangeMap.search) {
      this.fetchAsyncData(true);
    }
  }

  /**
   * 인터섹션 옵저버 설정
   */
  setupIntersectionObserver() {
    // 기존 옵저버가 있다면 정리
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    const options = {
      root: null, // 뷰포트를 root로 사용
      rootMargin: "100px", // 100px 미리 감지
      threshold: 0.1, // 10% 보일 때 트리거
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && this.canLoadMore()) {
          this.loadMoreProducts();
        }
      });
    }, options);

    // 타겟 엘리먼트에 옵저버 연결
    const target = this.target.querySelector("#product-intersection-target");
    if (target) {
      this.intersectionObserver.observe(target);
    }
  }

  /**
   * 스크롤 이벤트 리스너 설정 (테스트 호환성을 위해)
   */
  setupScrollListener() {
    this.handleScroll = () => {
      // 스크롤이 페이지 하단 근처에 도달했는지 확인
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // 페이지 하단 100px 전에 도달하면 추가 로드
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (this.canLoadMore()) {
          this.loadMoreProducts();
        }
      }
    };

    window.addEventListener("scroll", this.handleScroll);
  }

  /**
   * 더 많은 상품을 로드할 수 있는지 확인
   */
  canLoadMore() {
    return !this.state.loading && !this.isLoadingMore && this.hasMorePages() && !this.state.isError;
  }

  /**
   * 더 로드할 페이지가 있는지 확인
   */
  hasMorePages() {
    const { page, limit, total } = this.state.pagination;
    const totalPages = Math.ceil(total / limit);
    return page < totalPages;
  }

  /**
   * 다음 페이지 상품들을 로드
   */
  async loadMoreProducts() {
    if (!this.canLoadMore()) {
      return;
    }

    try {
      this.isLoadingMore = true;

      // 다음 페이지 계산
      const nextPage = this.state.pagination.page + 1;

      const searchParams = {
        page: nextPage,
        limit: this.state.pagination.limit,
        search: this.state.filters.search,
        category1: this.state.filters.category1,
        category2: this.state.filters.category2,
        sort: this.state.filters.sort,
      };

      const productResponse = await getProducts(searchParams);

      // 기존 상품 목록에 새로운 상품들 추가
      const updatedProducts = [...this.state.products, ...productResponse.products];

      this.setState({
        products: updatedProducts,
        pagination: productResponse.pagination,
        loading: false,
      });

      // DOM 업데이트 후 인터섹션 옵저버 재설정
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 0);
    } catch (error) {
      console.error("추가 상품 로드 실패:", error);
      // 에러 시 토스트 메시지 표시
      if (this.toast) {
        this.toast.show("error", HomePageViewModel.MESSAGES.LOAD_MORE_ERROR);
      }
    } finally {
      this.isLoadingMore = false;
    }
  }

  /**
   * 새로운 검색/필터 조건으로 첫 페이지부터 데이터 가져오기
   */
  async fetchAsyncData(resetPage = true) {
    try {
      this.setState({ loading: true });

      const searchParams = {
        page: resetPage ? 1 : this.state.pagination.page, // 새로운 검색 시 첫 페이지부터
        limit: this.state.pagination.limit,
        search: this.state.filters.search,
        category1: this.state.filters.category1,
        category2: this.state.filters.category2,
        sort: this.state.filters.sort,
      };

      const [productResponse, categoryResponse] = await Promise.all([getProducts(searchParams), getCategories()]);

      this.setState({
        loading: false,
        pagination: productResponse.pagination,
        products: productResponse.products, // 새로운 검색 시 기존 상품 목록 교체
        categories: categoryResponse,
      });

      // 새로운 데이터 로드 후 인터섹션 옵저버 재설정
      if (resetPage) {
        // DOM 업데이트 후 옵저버 재설정
        setTimeout(() => {
          this.setupIntersectionObserver();
        }, 0);
      }
    } catch {
      this.setState({ isError: true });
    }
  }

  /**
   * SELECT 옵션 생성 헬퍼 메서드
   */
  generateSelectOptions(options, currentValue, labelSuffix = "") {
    return options
      .map((option) => {
        const value = typeof option === "object" ? option.value : option;
        const label = typeof option === "object" ? option.label : `${option}${labelSuffix}`;
        const isSelected = currentValue === value;

        return /* html */ `<option value="${value}" ${isSelected ? "selected" : ""}>${label}</option>`;
      })
      .join("");
  }

  template() {
    if (this.state.isError) {
      return /* html */ `
        <div class="min-h-screen bg-gray-50">
          <main class="max-w-md m-auto px-4 py-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div class="flex flex-col gap-2 text-center text-red-500">
                <p>${HomePageViewModel.MESSAGES.ERROR_GENERAL}</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick="window.location.reload()">${HomePageViewModel.MESSAGES.REFRESH_BUTTON}</button>
              </div>
            </div>
          </main>
        </div>
      `;
    }

    const categoryOneDepth = Object.keys(this.state.categories);
    const categoryTwoDepth = Object.keys(this.state.categories[this.state.filters.category1] ?? {});

    const canCategoryOneDepthVisible = this.state.filters.category1 === "";
    const canCategoryTwoDepthVisible = this.state.filters.category1 !== "";

    return /* html */ `
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
          <div class="relative">
            <form id="search-form">
              <input
                type="text"
                id="search-input"
                placeholder="${HomePageViewModel.MESSAGES.SEARCH_PLACEHOLDER}"
                value="${this.state.filters.search}"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                
              />
            </form>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">${HomePageViewModel.MESSAGES.CATEGORY_LABEL}</label>

              <button id="bread-crumb-btn" data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">
                ${HomePageViewModel.MESSAGES.CATEGORY_ALL}
              </button>

              ${
                this.state.filters.category1 !== ""
                  ? /* html */ `
                    <span class="text-xs text-gray-500">&gt;</span>
                    <button id="bread-crumb-btn" data-breadcrumb="category1" data-category1="${this.state.filters.category1}" class="text-xs hover:text-blue-800 hover:underline">
                      ${this.state.filters.category1}
                    </button>
                  `
                  : ""
              }
              
              ${
                this.state.filters.category2 !== ""
                  ? /* html */ `
                    <span class="text-xs text-gray-500">&gt;</span>
                    <button id="bread-crumb-btn" data-breadcrumb="category2" data-category2="${this.state.filters.category2}" class="text-xs hover:text-blue-800 hover:underline">
                      ${this.state.filters.category2}
                    </button>
                  `
                  : ""
              }
            </div>
            <div class="flex flex-wrap gap-2">
              ${this.state.loading ? /* html*/ `<div class="text-sm text-gray-500 italic">${HomePageViewModel.MESSAGES.LOADING_CATEGORIES}</div>` : ""}
            </div>
          </div>
          <div class="space-y-2">
            <!-- 1depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              ${
                canCategoryOneDepthVisible
                  ? categoryOneDepth
                      .map((category) => {
                        const isSelected = this.state.filters.category1 === category;
                        const buttonClass = clsx(
                          "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 hover:bg-gray-50",
                          isSelected ? "text-blue-800" : "text-gray-700",
                        );

                        return /* html */ `
                          <button
                            id="category-filter-btn"
                            data-depth="1"
                            data-category="${category}"
                            class="${buttonClass}"
                          >
                            ${category}
                          </button>
                      `;
                      })
                      .join("")
                  : ""
              }
            </div>
            <!-- 2depth 카테고리 -->
            <div class="flex flex-wrap gap-2">
              ${
                canCategoryTwoDepthVisible
                  ? categoryTwoDepth
                      .map((category) => {
                        const isSelected = this.state.filters.category2 === category;
                        const buttonClass = clsx(
                          "category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 hover:bg-gray-50",
                          isSelected ? "text-blue-800" : "text-gray-700",
                        );

                        return /* html */ `
                          <button
                            id="category-filter-btn"
                            data-depth="2"
                            data-category="${category}"
                            class="${buttonClass}"
                          >
                            ${category}
                          </button>
                      `;
                      })
                      .join("")
                  : ""
              }
            </div>
          </div>
          
          <!-- 기존 필터들 -->
          <div class="flex gap-2 items-center justify-between">
            <!-- 페이지당 상품 수 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">${HomePageViewModel.MESSAGES.COUNT_LABEL}</label>
              <select 
                id="limit-select"
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value="${this.state.pagination.limit}"
              >
                ${this.generateSelectOptions(HomePageViewModel.LIMIT_OPTIONS, this.state.pagination.limit, "개")}
              </select>
            </div>
            
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">${HomePageViewModel.MESSAGES.SORT_LABEL}</label>
              <select 
                id="sort-select" 
                class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                ${this.generateSelectOptions(HomePageViewModel.SORT_OPTIONS, this.state.filters.sort)}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          ${
            this.state.loading
              ? /*html */ `
              <div class="mb-4 text-sm text-gray-600">
                ${HomePageViewModel.MESSAGES.LOADING_PRODUCTS}
              </div>
              `
              : /*html */ `
              <div class="mb-4 text-sm text-gray-600">
              ${HomePageViewModel.MESSAGES.TOTAL_PRODUCTS} <span class="font-medium text-gray-900">${this.state.pagination.total}${HomePageViewModel.MESSAGES.PRODUCTS_UNIT}</span>${HomePageViewModel.MESSAGES.PRODUCTS_SUFFIX}
              </div>
            `
          }
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            ${
              this.state.loading
                ? this.productSkeletonTemplate().repeat(this.state.pagination.limit)
                : this.productGridTemplate(this.state.products)
            }
          </div>

          <div id="product-intersection-target" class="h-4 w-full"></div>

          ${
            this.state.loading && this.state.products.length === 0
              ? /* html */ `
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path 
                    class="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span class="text-sm text-gray-600">${HomePageViewModel.MESSAGES.LOADING_PRODUCTS}</span>
              </div>
            </div>  
          `
              : this.isLoadingMore
                ? /* html */ `
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path 
                    class="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                                <span class="text-sm text-gray-600">${HomePageViewModel.MESSAGES.LOADING_MORE_PRODUCTS}</span>
              </div>
            </div>  
          `
                : this.state.products.length > 0 && !this.hasMorePages()
                  ? /* html */ `
            <div class="text-center py-8">
              <p class="text-sm text-gray-500">${HomePageViewModel.MESSAGES.ALL_PRODUCTS_LOADED}</p>
            </div>
          `
                  : ""
          }
        </div>
      </div>
    `;
  }

  productSkeletonTemplate() {
    return /* html */ `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    `;
  }

  productGridTemplate(products = []) {
    return products
      .map(
        (product) => /* html */ `
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card" id="product-card" data-product-id="${product.productId}">
            <!-- 상품 이미지 -->
            <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
              <img
                src="${product.image}"
                alt="${product.title}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
            
            <!-- 상품 정보 -->
            <div class="p-3">
              <div class="cursor-pointer product-info mb-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  ${product.title}
                </h3>
                <p class="text-xs text-gray-500 mb-2">${product.brand}</p>
                <p class="text-lg font-bold text-gray-900">
                  ${parseInt(product.lprice).toLocaleString()}원
                </p>
              </div>
              
              <!-- 장바구니 버튼 -->
              <button 
                class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors add-to-cart-btn" 
                data-product-id="${product.productId}"
                id="add-to-cart-btn"
              >
                ${HomePageViewModel.MESSAGES.CART_BUTTON}
              </button>
            </div>
          </div>
        `,
      )
      .join("");
  }

  initializeEventHandlers() {
    // 폼 제출 이벤트
    this.addEventDelegate("submit", "form", (e) => {
      this.handleFormSubmit(e);
    });

    // 검색어 입력 이벤트
    this.addEventDelegate("input", "#search-input", (e) => {
      this.handleChangeSearch(e);
    });

    // 정렬 및 필터 변경 이벤트
    this.addEventDelegate("change", "#limit-select", (e) => {
      this.handleChangeLimit(e);
    });

    this.addEventDelegate("change", "#sort-select", (e) => {
      this.handleChangeSort(e);
    });

    // 장바구니 추가 버튼 클릭
    this.addEventDelegate("click", "#add-to-cart-btn", (e) => {
      e.stopPropagation();
      this.handleAddToCart(e);
    });

    // 카테고리 필터 버튼 클릭
    this.addEventDelegate("click", "#category-filter-btn", (e) => {
      e.stopPropagation();
      this.handleCategoryFilter(e);
    });

    // 브레드크럼 버튼 클릭
    this.addEventDelegate("click", "#bread-crumb-btn", (e) => {
      e.stopPropagation();
      this.handleBreadCrumbClick(e);
    });

    // 상품 카드 클릭 (버튼 제외)
    this.addEventDelegate("click", "#product-card", (e) => {
      if (!e.target.closest("button")) {
        this.handleProductCardClick(e);
      }
    });
  }
}
