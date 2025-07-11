import Component from "../core/component";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { getProducts } from "../api/productApi";
import urlSearchParamsStore from "../core/store/urlSearchParamsStore";
import { getProductParams } from "../pages/Main";

class ProductList extends Component {
  async setup() {
    urlSearchParamsStore.subscribe(() => this.updateProductList());

    this.state = {
      isLoading: true,
      productData: null,
    };

    this.children = {
      productSkeleton: {
        component: ProductSkeleton,
        props: { length: 4 },
      },
    };

    await this.updateProductList();
  }

  template() {
    const productList = this.state.productData?.products ?? [];
    const productTotalLength = `${this.state.productData?.pagination?.total ?? ""}`;
    const isLoading = this.state?.isLoading;

    return `
      <div class="mb-6">
        <div>
          <!-- 상품 개수 정보 -->
          <div class="mb-4 text-sm text-gray-600">
            총 <span class="font-medium text-gray-900">${productTotalLength}개</span>의 상품
          </div>
          <!-- 상품 그리드 -->
          <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
            ${
              isLoading
                ? this.createBoxlessContainer("productSkeleton")
                : productList.map((product) => this.createBoxlessContainer(`product${product.productId}`)).join("\n")
            }
          </div>
          <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
        </div>
      </div>
    `;
  }

  async updateProductList() {
    const productParams = getProductParams();

    if (!this.state?.isLoading) {
      this.setState({
        isLoading: true,
      });
    }

    const productData = await getProducts(productParams);

    const productChildren = productData?.products?.reduce((acc, product) => {
      acc[`product${product.productId}`] = { props: product, component: ProductCard };
      return acc;
    }, {});

    this.children = {
      productSkeleton: {
        component: ProductSkeleton,
        props: { length: 4 },
      },
      ...productChildren,
    };

    this.setState({
      isLoading: false,
      productData,
    });
  }
}

export default ProductList;
