import { Component } from "../../../componet";
import { EventDelegator } from "../../../event-delegator";
import { handleProductDetail } from "../../features/product/controller/handle-product-detail";
import { productDetailStore } from "../../features/product/model/product-detail-store";
import { RelatedProductList } from "./RelatedProductList";
import { ProductDetailLoading } from "./ProductDetailLoading";
import { ProductDetailContent } from "./ProductDetailContent";

export class ProductDetailPage extends Component<{}, { cartCount: number }> {
  RelatedProductList = new RelatedProductList();
  ProductDetailLoading = new ProductDetailLoading();
  ProductDetailContent = new ProductDetailContent();

  subscribeStoreList: Array<() => void> = [];

  constructor(props?: {}) {
    super(props, { cartCount: 1 });
  }

  render(): HTMLElement {
    const el = document.createElement("div");
    el.innerHTML = `
      <main class="max-w-md mx-auto px-4 py-4" >
      <div id="product-detail-main"></div>
        <div id="related-product-container"></div></main>
    
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    `;
    return el;
  }

  componentDidMount() {
    handleProductDetail();

    // main 영역에 컴포넌트 mount
    const main = document.getElementById("product-detail-main");
    if (main) {
      this.ProductDetailContent.mount(main);
      this.ProductDetailLoading.mount(main);
    }

    const productContainer = document.getElementById("related-product-container");
    if (productContainer) {
      this.RelatedProductList.mount(productContainer);
    }
  }

  componentWillUnmount() {
    // 컴포넌트 언마운트
    this.ProductDetailContent.unmount();
    this.ProductDetailLoading.unmount();
    this.RelatedProductList.unmount();
    this.subscribeStoreList.forEach((unsubscribe) => unsubscribe());
  }
}
