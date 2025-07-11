import { getCategories, getProducts } from "../../api/productApi";
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { setToastState, Toast } from "../../components/layout/Toast";
import { updateCurrent } from "../../core/renderer";
import { Cart, cartState } from "../../features/cart/Cart";
import { createState, getSearchParams } from "../../utils/store";

import { CategorySection } from "./components/CategorySection";
import { FilterSection } from "./components/FilterSection";
import { ProductSection } from "./components/ProductSection";
import { SearchSection } from "./components/SearchSection";

const MAIN = "MAIN";

export const [getMainState, setMainState] = createState(MAIN, {
  products: [],
  isLoading: true,
  isInfiniteLoading: false,
  total: 0,
  page: 1,
  hasNext: null,
  categories: {},
  limit: getSearchParams().get("limit") || "20",
  sort: getSearchParams().get("sort") || "price_asc",
  search: getSearchParams().get("search") || "",
  category1: getSearchParams().get("category1") || "",
  category2: getSearchParams().get("category2") || "",
});

export const MainPage = () => {
  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header()}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          ${SearchSection()}
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">${CategorySection()}</div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">${FilterSection()}</div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>${ProductSection()}</div>
        </div>
      </main>
      ${Footer()} ${Toast()} ${Cart()}
    </div>
  `;
};

// 컴포넌트 라이프사이클 메서드들
MainPage.onMount = async () => {
  const searchParams = getSearchParams();

  // URL에서 폼 값들 가져오기
  const category1FromUrl = searchParams.get("category1") || "";
  const category2FromUrl = searchParams.get("category2") || "";
  const limitFromUrl = searchParams.get("limit") || "20";
  const sortFromUrl = searchParams.get("sort") || "price_asc";
  const searchFromUrl = searchParams.get("search") || "";

  cartState.isOpen = false;

  // mainState 완전 초기화
  setMainState({
    products: [],
    isLoading: true,
    isInfiniteLoading: false,
    total: 0,
    page: 1,
    hasNext: null,
    categories: {},
    category1: category1FromUrl,
    category2: category2FromUrl,
    limit: limitFromUrl,
    sort: sortFromUrl,
    search: searchFromUrl,
  });

  // 초기 렌더링

  updateCurrent();

  const [productsData, categoriesData] = await Promise.all([
    getProducts(Object.fromEntries(searchParams)),
    getCategories(),
  ]);

  // API 응답 데이터로 store 업데이트
  setMainState((prevState) => ({
    ...prevState,
    products: productsData.products,
    total: productsData.pagination.total,
    categories: categoriesData,
    isLoading: false,
    hasNext: productsData.pagination.hasNext,
    page: productsData.pagination.page,
    category1: productsData.filters.category1,
    category2: productsData.filters.category2,
  }));

  // 최종 렌더링
  updateCurrent();
};

MainPage.onUnmount = () => {
  const searchParams = getSearchParams();

  const category1FromUrl = searchParams.get("category1") || "";
  const category2FromUrl = searchParams.get("category2") || "";
  const limitFromUrl = searchParams.get("limit") || "20";
  const sortFromUrl = searchParams.get("sort") || "price_asc";
  const searchFromUrl = searchParams.get("search") || "";

  cartState.isOpen = false;

  setToastState({
    toastType: null,
  });

  // mainState 완전 초기화
  setMainState({
    products: [],
    isLoading: true,
    isInfiniteLoading: false,
    total: 0,
    page: 1,
    hasNext: null,
    categories: {},
    category1: category1FromUrl,
    category2: category2FromUrl,
    limit: limitFromUrl,
    sort: sortFromUrl,
    search: searchFromUrl,
  });
};
