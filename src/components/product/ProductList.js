import { getProducts } from "../../api/productApi";
import { DEFAULT_PAGE } from "../../constants.js";
import { useNavigate } from "../../hook/useRouter.js";
import Component from "../../lib/Component";
import { homeStore } from "../../store/homeStore";
import getFilter from "../../utils/getFilter.js";
import ProductItem from "./ProductItem";

export default class ProductList extends Component {
  setup() {
    this.prevFilterState = null;

    // ! 이벤트 핸들러를 미리 바인딩해서 보관
    // ! this.handleClick이 항상 같은 함수 객체가 되도록
    // * bind : 클래스 메서드는 this가 동적으로 결정, handleProductClick는 함수이고 호출 시 객체 인스턴스와 연결되어있지 않음
    this.handleProductClick = this.handleProductClick.bind(this);
    this.handleQueryParamsChange = this.handleQueryParamsChange.bind(this);

    // 쿼리 파라미터 변경 이벤트 리스너 추가
    window.addEventListener("queryParamsChange", this.handleQueryParamsChange);

    this.unsubscribe = homeStore.subscribe(() => {
      const { limit, sort, search, category1, category2 } = getFilter();

      const currentState = homeStore.getState();
      const currentParams = {
        page: currentState.products.pagination.page,
        limit,
        search,
        category1,
        category2,
        sort,
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

  // 쿼리 파라미터 변경 이벤트 핸들러
  handleQueryParamsChange() {
    // 페이지를 1로 리셋하고 상품 목록 재조회
    homeStore.setState({
      products: {
        pagination: {
          ...homeStore.getState().products.pagination,
          page: DEFAULT_PAGE,
        },
      },
    });
  }

  setEvent() {
    this.$target.addEventListener("click", this.handleProductClick);
    this.handleAddToCart();
  }

  cleanup() {
    this.$target.removeEventListener("click", this.handleProductClick);

    // 쿼리 파라미터 변경 이벤트 리스너 제거
    window.removeEventListener("queryParamsChange", this.handleQueryParamsChange);

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
    e.stopPropagation();

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
    const { limit, sort, search, category1, category2 } = getFilter();

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
        isProductsLoading: false,
        list: products,
        total: pagination.total,
        pagination,
      },
    });
  }

  handleAddToCart() {
    const { cart, products } = homeStore.getState();

    const $cartButton = document.querySelectorAll(".add-to-cart-btn");
    if (!$cartButton.length) return;

    $cartButton.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = e.target.dataset.productId;
        const product = products.list.find((product) => product.productId === productId);
        const isExist = cart.items.some((item) => item.productId === productId);

        if (isExist) return;

        homeStore.setState({
          cart: {
            items: [...cart.items, { ...product, quantity: 1 }],
          },
        });
      });
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
