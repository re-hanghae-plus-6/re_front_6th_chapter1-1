import { MainPage } from "./pages/MainPage.js";
import { Footer } from "./pages/Footer.js";
import { getProducts } from "./api/productApi.js";
import { getCategories } from "./api/productApi.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 1. 상태를 한 곳에서 관리
let state = {
  products: [],
  total: 0,
  categories: [],
  limit: 20,
  loading: false,
  // ...필요한 상태 추가
};

// 2. 상태에 따라 UI를 그리는 함수
function render() {
  document.getElementById("root").innerHTML = `
    ${MainPage({ ...state, onLimitChange })}
    ${Footer()}
  `;

  // ✅ select DOM이 다시 생성되므로 여기서 이벤트 등록
  const select = document.getElementById("limit-select");
  if (select) {
    select.addEventListener("change", (e) => {
      onLimitChange(Number(e.target.value));
    });
  }
}

// 3. 데이터 fetch 및 상태 갱신 함수
async function fetchAndRender() {
  state.loading = true;
  render();
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([getProducts({ limit: state.limit }), getCategories()]);

  state = {
    ...state,
    products,
    total,
    categories,
    loading: false,
  };

  render();
}

// 4. 이벤트 핸들러는 상태를 바꾸고 fetchAndRender 호출
function onLimitChange(newLimit) {
  state.limit = newLimit;
  fetchAndRender();
}

// 5. 앱 시작
function startApp() {
  if (import.meta.env.MODE !== "test") {
    enableMocking().then(fetchAndRender);
  } else {
    fetchAndRender();
  }
}

startApp();
