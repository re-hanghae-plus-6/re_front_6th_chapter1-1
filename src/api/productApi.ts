import { searchParamsStore } from "../features/common/search-params/search-params-store";

export type Product = {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
};

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search: string;
    category1: string;
    category2: string;
    sort: string;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category1?: string;
  category2?: string;
  sort?: string;
}

// 상품 목록 조회
export async function getProducts(): Promise<ProductListResponse> {
  const params = searchParamsStore.value;

  const { limit = "20", search = "", category1 = "", category2 = "", sort = "price_asc" } = params ?? {};

  const page = params?.current ?? params?.page ?? "1";

  const searchParams = new URLSearchParams({
    page: page,
    limit: limit,
    ...(search && { search }),
    ...(category1 && { category1 }),
    ...(category2 && { category2 }),
    sort,
  });

  const response = await fetch(`/api/products?${searchParams}`);

  return await response.json();
}

// 상품 상세 조회
export interface ProductDetail extends Product {
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
}

export async function getProduct(productId: string): Promise<ProductDetail> {
  const response = await fetch(`/api/products/${productId}`);
  return await response.json();
}

// 카테고리 목록 조회
export type CategoryMap = {
  [category1: string]: {
    [category2: string]: object;
  };
};

export async function getCategories(): Promise<CategoryMap> {
  const response = await fetch("/api/categories");
  return await response.json();
}
