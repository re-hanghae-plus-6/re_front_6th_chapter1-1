import ProductContainer from './components/product/product-container/ProductContainer.js';

function HomePage() {
  return `
    <main class="max-w-md mx-auto px-4 py-4">HomePage
      <!-- 상품 목록 -->
      <div class="mb-6">
        <div>
          ${ProductContainer()}
        </div>
    </main>`;
}

export default HomePage;
