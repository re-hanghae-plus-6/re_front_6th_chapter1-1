import { getProducts } from "../../api/productApi";
import Component from "../../lib/Component";
import { homeStore } from "../../store/homeStore";
import ProductItem from "./ProductItem";
import { useNavigate } from "../../hook/useRouter.js";

export default class ProductList extends Component {
  setup() {
    this.prevFilterState = null;

    // ! 이벤트 핸들러를 미리 바인딩해서 보관
    // ! this.handleClick이 항상 같은 함수 객체가 되도록
    this.handleProductClick = this.handleProductClick.bind(this);

    this.unsubscribe = homeStore.subscribe(() => {
      const currentState = homeStore.getState();
      const currentParams = {
        page: currentState.products.pagination.page,
        limit: currentState.filter.limit,
        search: currentState.filter.search,
        category1: currentState.filter.category1,
        category2: currentState.filter.category2,
        sort: currentState.filter.sort,
      };

      if (this.shouldFetchProducts(currentParams)) {
        this.fetchProducts();
      }

      this.render();
      this.setEvent();
      this.mounted();

      this.prevFilterState = currentParams;
    });
  }

  setEvent() {
    this.$target.addEventListener("click", this.handleProductClick);
  }

  cleanup() {
    this.$target.removeEventListener("click", this.handleProductClick);

    // 상태 구독 해제
    if (this.unsubscribe) this.unsubscribe();
  }

  shouldFetchProducts(currentParams) {
    // 첫 번째 로드인 경우
    if (!this.prevFilterState) {
      return true;
    }

    // 필터 조건이 변경된 경우
    const paramKeys = ["page", "search", "category1", "category2", "sort", "limit"];
    return paramKeys.some((key) => this.prevFilterState[key] !== currentParams[key]);
  }

  handleProductClick(e) {
    const { navigate } = useNavigate();

    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.productId;
      navigate(`/product/${productId}`);
    }
  }

  async fetchProducts() {
    const homeState = homeStore.getState();
    const {
      isProductsLoading,
      pagination: { page },
    } = homeState.products;
    const { category1, category2, search, sort, limit } = homeState.filter;

    if (isProductsLoading) return;

    homeStore.setState({
      products: {
        ...homeState.products,
        isProductsLoading: true,
      },
    });

    const params = {
      page,
      limit,
      search,
      category1,
      category2,
      sort,
    };

    const { products, pagination } = await getProducts(params);

    homeStore.setState({
      products: {
        ...homeState.products,
        isProductsLoading: false,
        list: products,
        total: pagination.total,
        pagination,
      },
    });
  }

  loadingTemplate() {
    return /* HTML */ ` <div class="grid grid-cols-2 gap-4">
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-gray-200"></div>
        <div class="p-3">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>`;
  }

  template() {
    const {
      products: { list, total, isProductsLoading },
    } = homeStore.getState();

    if (isProductsLoading) {
      return this.loadingTemplate();
    }

    return /* HTML */ ` <div>
      <!-- 상품 개수 정보 -->
      <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${total}개</span>의 상품
      </div>
      <!-- 상품 그리드 -->
      <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${isProductsLoading ? this.loadingTemplate() : list.map(ProductItem).join("")}
      </div>

      <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
    </div>`;
  }
}
