import { Component } from "../../../componet";
import type { Product } from "../../api/productApi";
import { productDetailStore } from "../../features/product/model/product-detail-store";
import { getProducts } from "../../api/productApi";

interface RelatedProductListState {
  products: Product[];
}

export class RelatedProductList extends Component<{}, RelatedProductListState> {
  constructor() {
    super({}, { products: [] });
  }

  async fetchRelatedProducts() {
    const detail = productDetailStore.value.data;

    if (!detail) return;
    const params = {
      category1: detail.category1,
      category2: detail.category2,
      limit: 20,
    };
    const response = await fetch(
      `/api/products?category1=${params.category1}&category2=${params.category2}&limit=${params.limit}`,
    );
    const data = await response.json();
    if (data && data.products) {
      const related = data.products.filter((p: Product) => p.productId !== detail.productId);

      this.state = { products: related };
    }
  }

  render(): HTMLElement {
    const { products } = this.state;

    const el = document.createElement("div");

    if (products.length === 0) {
      return el;
    }

    el.className = "bg-white rounded-lg shadow-sm";
    el.innerHTML = `
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
        <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-3 responsive-grid">
          ${
            products.length === 0
              ? `<div class='text-gray-400 col-span-2 text-center'>관련 상품이 없습니다.</div>`
              : products
                  .map(
                    (item) => `

                  
              <a href="/product/${item.productId}"  data-link
                  data-product-id="${item.productId}" class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${item.productId}">
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${item.title}</h3>
                <p class="text-sm font-bold text-blue-600">${Number(item.lprice).toLocaleString()}원</p>
              </a>

            `,
                  )
                  .join("")
          }
        </div>
      </div>
    `;

    return el;
  }

  componentDidMount(): void {
    this.fetchRelatedProducts();
    productDetailStore.subscribe(() => {
      this.fetchRelatedProducts();
    });
  }
}
