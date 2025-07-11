import { http, HttpResponse } from "msw";
import items from "./items.json";

const delay = async () => await new Promise((resolve) => setTimeout(resolve, 200));

// 카테고리 추출 함수
function getUniqueCategories() {
  const categoriesMap = {};

  items.forEach((item) => {
    const cat1 = item.category1;
    const cat2 = item.category2;

    if (!categoriesMap[cat1]) {
      categoriesMap[cat1] = new Set();
    }
    if (cat2) {
      categoriesMap[cat1].add(cat2);
    }
  });

  // CategoryStore에서 기대하는 형태로 변환
  const categories = Object.keys(categoriesMap).map((cat1) => ({
    name: cat1,
    subCategories: Array.from(categoriesMap[cat1]),
  }));

  return categories;
}

// 상품 검색 및 필터링 함수
function filterProducts(products, query) {
  let filtered = [...products];

  // 검색어 필터링
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(searchTerm) || item.brand.toLowerCase().includes(searchTerm),
    );
  }

  // 카테고리 필터링
  if (query.category1) {
    filtered = filtered.filter((item) => item.category1 === query.category1);
  }
  if (query.category2) {
    filtered = filtered.filter((item) => item.category2 === query.category2);
  }

  // 정렬
  if (query.sort) {
    switch (query.sort) {
      case "price_asc":
        filtered.sort((a, b) => parseInt(a.lprice) - parseInt(b.lprice));
        break;
      case "price_desc":
        filtered.sort((a, b) => parseInt(b.lprice) - parseInt(a.lprice));
        break;
      case "name_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title, "ko"));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title, "ko"));
        break;
      default:
        // 기본은 가격 낮은 순
        filtered.sort((a, b) => parseInt(a.lprice) - parseInt(b.lprice));
    }
  }

  return filtered;
}

export const handlers = [
  // 상품 목록 API
  http.get("/api/products", async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? url.searchParams.get("current")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const search = url.searchParams.get("search") || "";
    const category1 = url.searchParams.get("category1") || "";
    const category2 = url.searchParams.get("category2") || "";
    const sort = url.searchParams.get("sort") || "price_asc";

    // 필터링된 상품들
    const filteredProducts = filterProducts(items, {
      search,
      category1,
      category2,
      sort,
    });

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // 응답 데이터
    const response = {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1,
      },
      filters: {
        search,
        category1,
        category2,
        sort,
      },
    };

    await delay();

    return HttpResponse.json(response);
  }),

  // 상품 상세 API
  http.get("/api/products/:id", async ({ params }) => {
    const { id } = params;
    const product = items.find((item) => item.productId === id);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await delay();
    return HttpResponse.json(product);
  }),

  // 카테고리 목록 API
  http.get("/api/categories", async () => {
    const categories = getUniqueCategories();
    await delay();
    return HttpResponse.json(categories);
  }),
];
