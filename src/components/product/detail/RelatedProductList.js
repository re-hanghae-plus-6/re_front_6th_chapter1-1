import Link from "../../common/Link";
import ListView from "../../common/ListView";

function RelatedProductList({ relatedProductList }) {
  return buildRelatedProductList({ products: relatedProductList });
}

function buildRelatedProductList({ products }) {
  const buildContainer = () => {
    const container = document.createElement("div");
    container.className = "bg-white rounded-lg shadow-sm";

    return container;
  };

  const buildHeader = () => {
    const header = document.createElement("div");
    header.className = "p-4 border-b border-gray-200";
    header.innerHTML = /* HTML */ `
      <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
      <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
    `;

    return header;
  };

  const buildProductListContent = () => {
    const productListContent = document.createElement("div");
    productListContent.className = "p-4";

    productListContent.appendChild(
      ListView({
        list: products,
        renderItem: (product) =>
          Link({
            to: `/product/${product.productId}`,
            children: /* HTML */ `
              <div
                class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer"
                data-product-id="${product.productId}"
              >
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img
                    src="${product.image}"
                    alt="${product.title}"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
                <p class="text-sm font-bold text-blue-600">${product.lprice}원</p>
              </div>
            `,
          }),
        className: "grid grid-cols-2 gap-3 responsive-grid",
      }),
    );

    return productListContent;
  };

  const container = buildContainer();
  container.appendChild(buildHeader());
  container.appendChild(buildProductListContent());

  return container;
}

export default RelatedProductList;
