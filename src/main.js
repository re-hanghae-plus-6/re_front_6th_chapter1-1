import { MainList } from "./components/pages/MainList.js";
import { getProducts } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// infinite scroll 상태 관리
let currentPage = 1;
let currentLimit = 20;
let currentSort = "price_asc";
let hasNext = true;
let allProducts = [];

async function main() {
  // 1) 로딩 표시
  document.getElementById("root").innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort });

  try {
    // 2) MSW mock 데이터를 받아옴
    const data = await getProducts({ page: 1, limit: currentLimit, sort: currentSort });
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = data.products;
    // 3) 실제 UI 렌더

    document.getElementById("root").innerHTML = MainList({
      loading: false,
      products: allProducts,
      limit: currentLimit,
      sort: currentSort,
    });
  } catch (err) {
    console.error("상품을 가져오는 중 에러:", err);
    document.getElementById("root").innerHTML =
      `<p class="text-center text-red-500">상품을 불러오는 데 실패했습니다.</p>`;
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

// limit, sort change 이벤트 위임
const root = document.getElementById("root");
root.addEventListener("change", async (e) => {
  if (e.target.id === "limit-select" || e.target.id === "sort-select") {
    currentLimit = Number(document.getElementById("limit-select").value);
    currentSort = document.getElementById("sort-select").value;
    // 로딩 화면
    root.innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort });
    const data = await getProducts({ page: 1, limit: currentLimit, sort: currentSort });
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    allProducts = data.products;
    root.innerHTML = MainList({ loading: false, products: allProducts, limit: currentLimit, sort: currentSort });
  }
});

// 무한 스크롤 이벤트
window.addEventListener("scroll", async () => {
  if (!hasNext) return;
  const scrollPos = window.innerHeight + window.scrollY;
  const threshold = document.documentElement.scrollHeight - 100;
  if (scrollPos >= threshold) {
    // 전체 로딩 스켈레톤 렌더
    root.innerHTML = MainList({ loading: true, limit: currentLimit, sort: currentSort });
    // 다음 페이지 데이터 fetch
    const nextPage = currentPage + 1;
    const data = await getProducts({ page: nextPage, limit: currentLimit, sort: currentSort });
    currentPage = data.pagination.page;
    hasNext = data.pagination.hasNext;
    // 기존 배열에 추가 후 전체 UI 갱신
    allProducts = allProducts.concat(data.products);
    root.innerHTML = MainList({ loading: false, products: allProducts, limit: currentLimit, sort: currentSort });
  }
});
