import { 상품상세_스켈레톤 } from "./product-detail-loading.ts";
import { 상품상세_본문 } from "./product-detail-body.ts";
import type { BodyProps } from "./product-detail-body.ts";

export interface Props {
  loading?: boolean;
  product?: BodyProps["product"];
  relatedProducts?: BodyProps["relatedProducts"];
  qty?: number;
  cartCount?: number; // 헤더 배지용(추후)
}

export const 상품상세_레이아웃 = ({
  loading = false,
  product,
  relatedProducts = [],
  qty = 1,
  cartCount = 0,
}: Props): string => {
  const bodyHtml = loading ? 상품상세_스켈레톤() : product && 상품상세_본문({ product, relatedProducts, qty });

  const badgeHtml =
    cartCount > 0
      ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${cartCount}</span>`
      : "";

  const headerHtml = `
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
          </div>
          <div class="flex items-center space-x-2">
            <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              ${badgeHtml}
            </button>
          </div>
        </div>
      </div>
    </header>`;

  const footerHtml = `
    <footer class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto py-8 text-center text-gray-500">
        <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
      </div>
    </footer>`;

  return `
    <div class="min-h-screen bg-gray-50">
      ${headerHtml}
      <main class="max-w-md mx-auto px-4 py-4">
        ${bodyHtml}
      </main>
      ${footerHtml}
    </div>
  `;
};
