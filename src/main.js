// 라우터 import 추가
import { createRouter } from "./router/Router.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// HomePage 컴포넌트 - 분리된 Header, Footer 사용
function HomePage(query = {}) {
  const { search = "", sort = "price_asc", limit = "20" } = query;

  return `
    <div class="bg-gray-50">
      ${Header({ title: "쇼핑몰", cartCount: 4 })}
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="${search}" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
              </div>
              <!-- 1depth 카테고리 -->
              <div class="flex flex-wrap gap-2">
                <button data-category1="생활/건강" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  생활/건강
                </button>
                <button data-category1="디지털/가전" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  디지털/가전
                </button>
              </div>
              <!-- 2depth 카테고리 -->
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10" ${limit === "10" ? 'selected=""' : ""}>
                    10개
                  </option>
                  <option value="20" ${limit === "20" ? 'selected=""' : ""}>
                    20개
                  </option>
                  <option value="50" ${limit === "50" ? 'selected=""' : ""}>
                    50개
                  </option>
                  <option value="100" ${limit === "100" ? 'selected=""' : ""}>
                    100개
                  </option>
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="price_asc" ${sort === "price_asc" ? 'selected=""' : ""}>가격 낮은순</option>
                  <option value="price_desc" ${sort === "price_desc" ? 'selected=""' : ""}>가격 높은순</option>
                  <option value="name_asc" ${sort === "name_asc" ? 'selected=""' : ""}>이름순</option>
                  <option value="name_desc" ${sort === "name_desc" ? 'selected=""' : ""}>이름 역순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 -->
            <div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">340개</span>의 상품
            </div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
                   data-product-id="85067212996">
                <!-- 상품 이미지 -->
                <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
                  <img src="https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg"
                       alt="PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장"
                       class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                       loading="lazy">
                </div>
                <!-- 상품 정보 -->
                <div class="p-3">
                  <div class="cursor-pointer product-info mb-3">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장
                    </h3>
                    <p class="text-xs text-gray-500 mb-2"></p>
                    <p class="text-lg font-bold text-gray-900">
                      220원
                    </p>
                  </div>
                  <!-- 장바구니 버튼 -->
                  <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="85067212996">
                    장바구니 담기
                  </button>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
                   data-product-id="86940857379">
                <!-- 상품 이미지 -->
                <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
                  <img src="https://shopping-phinf.pstatic.net/main_8694085/86940857379.1.jpg"
                       alt="샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이"
                       class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                       loading="lazy">
                </div>
                <!-- 상품 정보 -->
                <div class="p-3">
                  <div class="cursor-pointer product-info mb-3">
                    <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이
                    </h3>
                    <p class="text-xs text-gray-500 mb-2">이지웨이건축자재</p>
                    <p class="text-lg font-bold text-gray-900">
                      230원
                    </p>
                  </div>
                  <!-- 장바구니 버튼 -->
                  <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="86940857379">
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
            
            <div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>
          </div>
        </div>
      </main>
      ${Footer()}
    </div>
  `;
}

function ProductDetailPage(params = {}) {
  const { id } = params;
  return `
    <div class="bg-gray-50">
      ${Header({ title: "상품 상세", showBackButton: true, cartCount: 1 })}
      <main class="max-w-md mx-auto px-4 py-4">
        <h1>상품 상세 페이지</h1>
        <p>상품 ID: ${id || "없음"}</p>
        <p>현재 경로: ${window.location.pathname}</p>
      </main>
      ${Footer()}
    </div>
  `;
}

function NotFoundPage() {
  return `
    <div class="bg-gray-50">
      ${Header({ title: "404 페이지" })}
      <main class="max-w-md mx-auto px-4 py-4">
        <h1>404 페이지</h1>
        <p>404 경로: ${window.location.pathname}</p>
      </main>
      ${Footer()}
    </div>
  `;
}

// 전역 router 변수
let router;

function main() {
  const root = document.getElementById("root");
  if (!root) return;

  // 라우터 설정
  router = createRouter({
    routes: [
      { path: "/", component: "Home" },
      { path: "/product/:id", component: "ProductDetail" },
      { path: "*", component: "NotFound" },
    ],

    onNavigate: (route, query) => {
      // URLSearchParams를 객체로 변환
      const queryObj = {};
      for (const [key, value] of query) {
        queryObj[key] = value;
      }

      // 라우트에 따라 렌더링
      let html = "";
      switch (route.component) {
        case "Home":
          html = HomePage(route.params, queryObj); // 쿼리 전달
          break;
        case "ProductDetail":
          html = ProductDetailPage(route.params, queryObj);
          break;
        case "NotFound":
        default:
          html = NotFoundPage();
          break;
      }

      // DOM에 렌더링
      const currentRoot = document.getElementById("root");
      if (currentRoot) {
        currentRoot.innerHTML = html;
      }
    },
  });

  // 전역 스코프에 router 노출
  window.router = router;

  // 라우터 초기화
  router.init();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
