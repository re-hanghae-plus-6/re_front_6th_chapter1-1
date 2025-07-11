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
  document.getElementById("root").innerHTML = MainList({ loading: true });

  try {
    // 2) MSW mock 데이터를 받아옴
    const data = await getProducts({ page: 1, limit: 20 });

    // 3) 실제 UI 렌더
    document.getElementById("root").innerHTML = MainList({
      loading: false,
      products: data.products,
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
