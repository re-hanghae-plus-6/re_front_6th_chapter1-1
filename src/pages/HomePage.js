import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Filter from "../components/filter/filter";
import ProductList from "../components/product/ProductList";

export default function HomePage() {
  const state = {
    products: [],
    total: 0,
  };

  return /* HTML */ `
    <div class="bg-gray-50">
      ${Header()}
      <main class="maxProductList-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        ${Filter()}
        <!-- 상품 목록 -->
        ${ProductList({
          products: state.products,
          total: state.total,
        })}
      </main>
      ${Footer()}
    </div>
  `;
}
