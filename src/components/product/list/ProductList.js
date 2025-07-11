import ListView from "../../common/ListView";
import ProductCard from "./ProductCard";
import Link from "../../common/Link";

function ProductList({ products, loading = false }) {
  if (loading) {
    return /* HTML */ `
      ${ListView({
        id: "products-grid",
        list: Array.from({ length: 4 }),
        renderItem: (product) => ProductCard({ product, loading: true }),
        className: "grid grid-cols-2 gap-4 mb-6",
      }).outerHTML}
    `;
  }

  return ListView({
    id: "products-grid",
    list: products,
    renderItem: (product) => Link({ to: `/product/${product.productId}`, children: ProductCard({ product }) }),
    className: "grid grid-cols-2 gap-4 mb-6",
  });
}

export default ProductList;
