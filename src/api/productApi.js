// 상품 목록 조회
export async function getProducts(params = {}) {
  const { limit = 20, search = "", category1 = "", category2 = "", sort = "price_asc" } = params;
  const page = params.current ?? params.page ?? 1;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category1 && { category1 }),
    ...(category2 && { category2 }),
    sort,
  });

  const response = await fetch(`/api/products?${searchParams}`);

  return await response.json();
}

// 상품 상세 조회
export async function getProduct(productId) {
  const response = await fetch(`/api/products/${productId}`);
  return await response.json();
}

// 카테고리 목록 조회
export async function getCategories() {
  const response = await fetch("/api/categories");
  return await response.json();
}

// 관련 상품 조회 (같은 category2의 다른 상품들)
export async function getRelatedProducts(product, limit = 20) {
  if (!product || !product.category2) {
    return [];
  }

  const { products } = await getProducts({
    category2: product.category2,
    limit: limit,
  });

  // 현재 상품은 관련 상품에서 제외
  return products.filter((p) => p.productId !== product.productId).slice(0, limit);
}
