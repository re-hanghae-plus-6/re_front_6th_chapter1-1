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

  try {
    const response = await fetch(`/api/products?${searchParams}`);

    if (!response.ok) {
      throw new Error(`상품 목록을 불러오는데 실패했습니다. (상태: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      throw new Error("네트워크 연결을 확인해주세요.");
    }
    throw error;
  }
}

export async function getProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("존재하지 않는 상품입니다.");
      }
      throw new Error(`상품 정보를 불러오는데 실패했습니다. (상태: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      throw new Error("네트워크 연결을 확인해주세요.");
    }
    throw error;
  }
}

export async function getCategories() {
  try {
    const response = await fetch("/api/categories");

    if (!response.ok) {
      throw new Error(`카테고리를 불러오는데 실패했습니다.`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      throw new Error("네트워크 연결을 확인해주세요.");
    }
    throw error;
  }
}
