// 상품 목록 조회
export async function getProducts(params = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    category1 = '',
    category2 = '',
    sort = 'price_asc',
  } = params;

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

  // 응답이 정상적이지 않으면 에러 발생
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Content-Type 확인
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Expected JSON but got:', text.substring(0, 200));
    throw new Error('Invalid response format: expected JSON');
  }

  return await response.json();
}

// 카테고리 목록 조회
export async function getCategories() {
  const response = await fetch('/api/categories');
  return await response.json();
}
