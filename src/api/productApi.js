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

  console.log("📡 API: 상품 요청 시작", { params, url: `/api/products?${searchParams}` });
  try {
    const response = await fetch(`/api/products?${searchParams}`);
    console.log("📡 API: 상품 응답 상태:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("✅ API: 상품 데이터:", { totalItems: data.products?.length, totalPages: data.pagination?.total });
    return data;
  } catch (error) {
    console.error("❌ API: 상품 요청 실패:", error);
    throw error;
  }
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
