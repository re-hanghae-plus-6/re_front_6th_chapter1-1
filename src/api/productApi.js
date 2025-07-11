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

// 상품 목록 조회 파라미터
export const getProductParams = () => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  return {
    ...(searchParams.get("page") && { page: searchParams.get("page") }),
    ...(searchParams.get("limit") && { limit: searchParams.get("limit") }),
    ...(searchParams.get("search") && { search: searchParams.get("search") }),
    ...(searchParams.get("category1") && { category1: searchParams.get("category1") }),
    ...(searchParams.get("category2") && { category2: searchParams.get("category2") }),
    ...(searchParams.get("sort") && { sort: searchParams.get("sort") }),
  };
};
