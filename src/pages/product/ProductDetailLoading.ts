import { Component } from "../../../componet";
import { productDetailStore } from "../../features/product/model/product-detail-store";

export class ProductDetailLoading extends Component {
  subscribeStoreList: Array<() => void> = [];

  render(): HTMLElement {
    const el = document.createElement("div");

    if (!productDetailStore.value.isLoading) {
      return el;
    }

    el.innerHTML = `
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    `;
    return el;
  }

  componentDidMount() {
    // 로딩 상태를 구독하여 상태 변경 시 업데이트
    this.subscribeStoreList.push(() => {
      productDetailStore.subscribe(() => {
        this.update();
      });
    });
  }
}
