// 메인 레이아웃 컴포넌트: 공통 레이아웃(헤더, 필터, 푸터) + children(상품 영역)
export function 상품목록_메인레이아웃() {
  return /* HTML */ `
    <main class="max-w-md mx-auto px-4 py-4">
      <!-- 검색 및 필터 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div id="name-filter-space" class="mb-4"></div>
        <!-- 필터 옵션 -->
        <div class="space-y-3">
          <!-- 카테고리 필터 -->
          <div id="category-filter-space" class="space-y-2"></div>
          <!-- 기존 필터들 -->
          <div id="original-filter-space" class="flex gap-2 items-center justify-between"></div>
        </div>
      </div>
      <!-- 상품 목록 영역 -->
      <div class="mb-6">
        <div id="product-container"></div>
      </div>
    </main>
    <footer class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto py-8 text-center text-gray-500">
        <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
      </div>
    </footer>
  `;
}
