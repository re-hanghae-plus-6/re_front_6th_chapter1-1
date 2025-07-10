// 상품 목록 조회
/**
 * @type {
 *  filters: {
 *    search: string
 *    category1: string
 *    category2: string
 *    sort: string
 *  }
 *  pagination: {
 *    hasNext: boolean
 *    hasPrev: boolean
 *    limit: number
 *    page: number
 *    total: number
 *    totalPages: number
 *  }
 *  products: {
 *    brand: string
 *    category1: string
 *    category2: string
 *    category3: string
 *    category4: string
 *    hprice: string
 *    image: string
 *    link: string
 *    lprice: string
 *    maker: string
 *    mallName: string
 *    productId: string
 *    productType: string
 *    title: string
 *  }
 * }
 */
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
/**
 * @type {
 *    brand: string
 *    category1: string
 *    category2: string
 *    category3: string
 *    category4: string
 *    hprice: string
 *    image: string
 *    link: string
 *    lprice: string
 *    maker: string
 *    mallName: string
 *    productId: string
 *    productType: string
 *    title: string
 *    description: string
 *    rating: number
 *    reviewCount: number
 *    stock: number
 *    images: string[]
 * }
 */
export async function getProduct(productId) {
  const response = await fetch(`/api/products/${productId}`);
  return await response.json();
}

// 카테고리 목록 조회
/**
 * @type {
 *  카테고리명: { 세부카테고리명: {} }[]
 * }
 */
export async function getCategories() {
  const response = await fetch("/api/categories");
  return await response.json();
}
