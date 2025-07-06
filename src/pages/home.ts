import { 상품목록_레이아웃_로딩 } from "../components/product-list/product-list-loading.ts";
import { 상품목록_레이아웃_로딩완료 } from "../components/product-list/index.ts";
import { getProducts } from "../api/productApi.js";

interface Product {
  title: string;
  lprice: string;
  image: string;
  productId: string;
}

interface State {
  products: Product[];
  total: number;
  loading: boolean;
  limit: number;
  sort: string;
}

export function homePage() {
  const root = document.getElementById("root");
  if (!root) return;

  // 컴포넌트 상태
  let state: State = {
    products: [],
    total: 0,
    loading: true,
    limit: 20,
    sort: "price_asc",
  };

  // 상태 업데이트 + 렌더 트리거 (React setState와 유사)
  const setState = (newState: Partial<State>) => {
    state = { ...state, ...newState };
    render();
  };

  // 순수 렌더 함수 (상태만 읽고 DOM 업데이트)
  const render = () => {
    if (state.loading) {
      root.innerHTML = 상품목록_레이아웃_로딩();
      return;
    }

    root.innerHTML = 상품목록_레이아웃_로딩완료({
      total: state.total,
      products: state.products.map((product) => ({
        id: product.productId,
        title: product.title,
        price: Number(product.lprice),
        imageUrl: product.image,
      })),
    });

    // 렌더 후 이벤트 바인딩
    bindEvents();
  };

  // 이벤트 바인딩 (렌더와 분리)
  const bindEvents = () => {
    const limitSelectEl = document.getElementById("limit-select") as HTMLSelectElement | null;
    if (limitSelectEl) {
      limitSelectEl.value = String(state.limit);
      limitSelectEl.addEventListener("change", handleLimitChange);
    }

    const sortSelectEl = document.getElementById("sort-select") as HTMLSelectElement | null;
    if (sortSelectEl) {
      sortSelectEl.value = state.sort;
      sortSelectEl.addEventListener("change", handleSortChange);
    }
  };

  // 드롭다운 변경 핸들러
  const handleLimitChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const newLimit = Number(select.value);
    if (newLimit !== state.limit) {
      setState({ limit: newLimit });
      loadProducts();
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const newSort = select.value;
    if (newSort !== state.sort) {
      setState({ sort: newSort });
      loadProducts();
    }
  };

  // 데이터 로드 (렌더 호출 없음, setState만 사용)
  const loadProducts = async () => {
    try {
      const data = await getProducts({ limit: state.limit, page: 1, sort: state.sort });
      setState({
        products: data.products as Product[],
        total: data.pagination.total ?? data.products.length,
        loading: false,
      });
    } catch (err) {
      root.textContent = "상품을 불러오는데 실패했습니다.";
      console.error(err);
    }
  };

  // 초기화: 스켈레톤 표시 → 데이터 로드
  render();
  loadProducts();
}
