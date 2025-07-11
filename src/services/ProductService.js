import { getProducts, getProduct, getCategories } from '../api/productApi.js';

export class ProductService {
  static async fetchProducts(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        search: filters.search || '',
        category1: filters.category1 || '',
        category2: filters.category2 || '',
        sort: filters.sort || 'price_asc',
      };

      const response = await getProducts(params);

      // MSW 응답 구조에 맞게 변환
      const products =
        response.products || response.data || response.results || response;

      // 필드명 매핑 (MSW 응답의 필드명을 앱에서 사용하는 필드명으로 변환)
      const normalizedProducts = Array.isArray(products)
        ? products.map((product) => ({
            id: product.productId || product.id,
            name: product.title || product.name,
            price: parseInt(product.lprice) || product.price || 0,
            image: product.image,
            category1: product.category1,
            category2: product.category2,
            brand: product.brand,
            link: product.link,
            mallName: product.mallName,
          }))
        : [];

      return {
        ...response,
        products: normalizedProducts,
        data: normalizedProducts, // 일관성을 위해 data 필드도 추가
        pagination: response.pagination || null, // 페이지네이션 정보 명시적 전달
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);

      // 토스트 메시지 표시
      if (typeof window !== 'undefined' && window.toastManager) {
        window.toastManager.show(
          '상품을 불러오는 중 오류가 발생했습니다',
          'error',
        );
      }

      throw error;
    }
  }

  static async fetchProductById(id) {
    try {
      const response = await getProduct(id);

      // 단일 상품 응답을 정규화
      if (response) {
        return {
          id: response.productId || response.id,
          name: response.title || response.name,
          price: parseInt(response.lprice) || response.price || 0,
          image: response.image,
          category1: response.category1,
          category2: response.category2,
          brand: response.brand,
          link: response.link,
          mallName: response.mallName,
          maker: response.maker,
          // 추가 필드들
          description:
            response.description ||
            `${response.title || response.name}에 대한 상세 설명입니다. 브랜드의 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`,
          rating: 4.0, // 기본 평점
          reviewCount: 749, // 기본 리뷰 수
          stock: 107, // 기본 재고
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch product:', error);

      // 토스트 메시지 표시
      if (typeof window !== 'undefined' && window.toastManager) {
        window.toastManager.show(
          '상품 정보를 불러오는 중 오류가 발생했습니다',
          'error',
        );
      }

      throw error;
    }
  }

  static sortProducts(products, sortType) {
    const sorted = [...products];

    switch (sortType) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }

  static filterProducts(products, filters) {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.category1) {
      filtered = filtered.filter(
        (product) => product.category1 === filters.category1,
      );
    }

    if (filters.category2) {
      filtered = filtered.filter(
        (product) => product.category2 === filters.category2,
      );
    }

    return filtered;
  }

  static async fetchCategories() {
    try {
      const response = await getCategories();
      return response;
    } catch (error) {
      console.error('Failed to fetch categories:', error);

      // 토스트 메시지 표시
      if (typeof window !== 'undefined' && window.toastManager) {
        window.toastManager.show(
          '카테고리를 불러오는 중 오류가 발생했습니다',
          'error',
        );
      }

      throw error;
    }
  }
}
