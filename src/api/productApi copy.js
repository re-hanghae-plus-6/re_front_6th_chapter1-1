const BASE_URL = "http://localhost:5173"; // 또는 네 환경에 맞게 설정

export async function getProducts(params = {}) {
  const { page = 1, limit = 20, search = "", category1 = "", category2 = "", sort = "price_asc" } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category1 && { category1 }),
    ...(category2 && { category2 }),
    sort,
  });

  const url = `${BASE_URL}/api/products?${searchParams}`;
  console.log("[getProducts] 요청 URL:", url);

  const response = await fetch(url);

  const text = await response.text();
  console.log("[getProducts] 응답 원문:", text);

  try {
    const data = JSON.parse(text);
    console.log("[getProducts] 파싱된 데이터:", data);
    return data;
  } catch (err) {
    console.error("[getProducts] JSON 파싱 실패:", err);
    throw err;
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
