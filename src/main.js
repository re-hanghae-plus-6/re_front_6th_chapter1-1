import { MainList } from "./components/pages/MainList.js";
import { getProducts } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

async function main() {
  // 1) 로딩 표시
  document.getElementById("root").innerHTML = MainList({ loading: true, limit: 20 });

  try {
    // 2) MSW mock 데이터를 받아옴
    const data = await getProducts({ page: 1, limit: 20 });
    // 3) 실제 UI 렌더
    document.getElementById("root").innerHTML = MainList({
      loading: false,
      products: data.products,
      limit: 20,
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

// limit-select change 이벤트를 root에 위임하도록 처리
const root = document.getElementById("root");

root.addEventListener("change", async (e) => {
  // limit 또는 sort 변경 시 전체 UI 재렌더링
  if (e.target.id === "limit-select" || e.target.id === "sort-select") {
    // 새로운 limit, sort 값 가져오기
    const newLimit = Number(document.getElementById("limit-select").value);
    const newSort = document.getElementById("sort-select").value;
    // 로딩 화면 표시
    root.innerHTML = MainList({ loading: true, limit: newLimit, sort: newSort });
    // 데이터 fetch
    const newData = await getProducts({ page: 1, limit: newLimit, sort: newSort });
    // 전체 UI 렌더
    root.innerHTML = MainList({
      loading: false,
      products: newData.products,
      limit: newLimit,
      sort: newSort,
    });
  }
});
