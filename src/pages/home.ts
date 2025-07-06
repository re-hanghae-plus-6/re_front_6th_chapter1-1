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
}

export function homePage() {
  const root = document.getElementById("root");
  if (!root) return;

  // 업데이트 시 주소 참조가 필요한 경우를 대비하여 let으로 객체 선언
  let state: State = {
    products: [],
    total: 0,
    loading: true,
  };

  // 뷰 업데이트용 렌더 함수 ─ 상태값만 읽어 DOM을 다시 그린다
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
  };

  // 데이터 로드 함수 – 상태를 갱신하고 render 호출
  const loadProducts = async () => {
    try {
      const data = await getProducts({ limit: 340, page: 1 });

      state = {
        products: data.products as Product[],
        total: data.pagination.total ?? data.products.length,
        loading: false,
      };
      render();
    } catch (err) {
      root.textContent = "상품을 불러오는데 실패했습니다.";
      console.error(err);
    }
  };

  // 초기 렌더 + 데이터 로드
  render();
  loadProducts();
}
