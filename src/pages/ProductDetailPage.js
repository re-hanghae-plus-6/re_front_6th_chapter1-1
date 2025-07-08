// 상품 상세 페이지 예시
export function ProductDetailPage({ productId }) {
  return `
    <div class="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">상품 상세 페이지</h1>
      <p class="text-gray-700">상품 ID: <span class="font-mono">${productId}</span></p>
      <a href="/" onclick="event.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate'));" class="text-blue-600 hover:underline mt-4 inline-block">메인으로 돌아가기</a>
    </div>
  `;
}

export function renderProductDetailPage(productId) {
  document.getElementById("root").innerHTML = ProductDetailPage({ productId });
}
