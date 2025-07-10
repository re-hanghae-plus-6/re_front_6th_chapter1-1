import { createObservable } from "./observable.js";

// 함수형 CategoryStore
function createCategoryStore() {
  // private 상태
  let categories = [];
  let selectedCategory1 = "";
  let selectedCategory2 = "";
  let loading = false;

  // 옵저버 패턴 생성
  const observable = createObservable();

  // 카테고리 데이터 로드
  async function loadCategories() {
    if (categories.length > 0) return; // 이미 로드된 경우 스킵

    loading = true;
    observable.notify();

    try {
      const { getCategories } = await import("../api/productApi.js");
      categories = await getCategories();
    } catch (error) {
      console.error("카테고리 로드 실패:", error);
      categories = [];
    } finally {
      loading = false;
      observable.notify();
    }
  }

  // 1depth 카테고리 선택
  function selectCategory1(category1) {
    selectedCategory1 = category1;
    selectedCategory2 = ""; // 1depth 변경 시 2depth 초기화
    observable.notify();
  }

  // 2depth 카테고리 선택
  function selectCategory2(category1, category2) {
    selectedCategory1 = category1;
    selectedCategory2 = category2;
    observable.notify();
  }

  // 카테고리 선택 초기화
  function resetSelection() {
    selectedCategory1 = "";
    selectedCategory2 = "";
    observable.notify();
  }

  // URL 파라미터에서 카테고리 상태 복원
  function setFromURLParams(params) {
    selectedCategory1 = params.category1 || "";
    selectedCategory2 = params.category2 || "";
    observable.notify();
  }

  // 현재 선택된 카테고리 정보 반환
  function getSelectedCategories() {
    return {
      category1: selectedCategory1,
      category2: selectedCategory2,
    };
  }

  // 전체 카테고리 목록 반환
  function getCategories() {
    return categories;
  }

  // 선택된 1depth 카테고리의 2depth 목록 반환
  function getSubCategories() {
    if (!selectedCategory1) return [];

    const category = categories.find((cat) => cat.name === selectedCategory1);
    return category ? category.subCategories : [];
  }

  // 로딩 상태 반환
  function getLoading() {
    return loading;
  }

  // 공개 API 반환
  return {
    subscribe: observable.subscribe,
    loadCategories,
    selectCategory1,
    selectCategory2,
    resetSelection,
    setFromURLParams,
    getSelectedCategories,
    getCategories,
    getSubCategories,
    getLoading,
  };
}

export const categoryStore = createCategoryStore();
