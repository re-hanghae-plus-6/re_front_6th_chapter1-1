import { 상품상세_스켈레톤 } from "./product-detail-loading.ts";
import { 상품상세_본문 } from "./product-detail-body.ts";
import type { BodyProps } from "./product-detail-body.ts";
import { 공통_헤더 } from "../header/index.ts";

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

  // 공통 헤더 HTML (뒤로가기 버튼 포함)
  const headerHtml = 공통_헤더({ cartCount, showBackButton: true, title: "상품 상세" });

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
