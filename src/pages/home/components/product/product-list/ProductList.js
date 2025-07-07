function ProductList({ children }) {
  return `
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
      ${children}
    </div>
  `;
}

export default ProductList;
