// import { getProducts } from "../api/productApi.js";

// /** URL 파라미터를 업데이트하는 공통 함수 */
// function updateUrlParams(updater) {
//   const url = new URL(window.location.href);
//   const params = url.searchParams;

//   updater(params);

//   window.history.replaceState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`);
// }

// /** 상품 데이터 API 호출 및 상태 갱신 + 렌더링 */
// async function fetchAndSetProducts(state, render, extraParams = {}) {
//   state.loading = true;
//   state.page = 1;
//   render();

//   const data = await getProducts({
//     page: state.page,
//     limit: state.limit,
//     search: state.search,
//     category1: state.category1,
//     category2: state.category2,
//     sort: state.selectedSort,
//     ...extraParams,
//   });

//   state.products = data.products;
//   state.total = data.pagination.total;
//   state.allLoaded = state.products.length >= data.pagination.total;
//   state.loading = false;

//   render();
// }

// /** 검색 핸들러 */
// export async function handleSearch(value, state, render) {
//   const keyword = value.trim().toLowerCase();

//   updateUrlParams((params) => {
//     if (keyword) params.set("search", keyword);
//     else params.delete("search");
//   });

//   state.search = keyword;
//   await fetchAndSetProducts(state, render);
// }

// /** 1뎁스 카테고리 필터 핸들러 */
// export function handleCategory1Filter(state, render) {
//   const category1Buttons = document.querySelectorAll(".category1-filter-btn");
//   category1Buttons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const category1 = btn.dataset.category1;

//       updateUrlParams((params) => {
//         if (category1) {
//           params.set("category1", category1);
//           params.delete("category2");
//         } else {
//           params.delete("category1");
//           params.delete("category2");
//         }
//       });

//       state.category1 = category1;
//       state.category2 = "";
//       fetchAndSetProducts(state, render);
//     });
//   });
// }

// /** 2뎁스 카테고리 필터 핸들러 */
// export function handleCategory2Filter(state, render) {
//   const category2Buttons = document.querySelectorAll(".category2-filter-btn");
//   category2Buttons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const category2 = btn.dataset.category2;

//       updateUrlParams((params) => {
//         if (category2) params.set("category2", category2);
//         else params.delete("category2");
//       });

//       state.category2 = category2;
//       fetchAndSetProducts(state, render);
//     });
//   });
// }

// /** 브레드크럼 전체 경로 클릭 핸들러 */
// export function handleResetBreadcrumb(state, render) {
//   document.querySelectorAll('button[data-breadcrumb="reset"]').forEach((btn) => {
//     btn.addEventListener("click", () => {
//       updateUrlParams((params) => {
//         params.delete("category1");
//         params.delete("category2");
//       });

//       fetchAndSetProducts(state, render, {
//         page: 1,
//         limit: parseInt(state.selectedLimit, 10),
//         search: state.search,
//         sort: state.selectedSort,
//         category1: "",
//         category2: "",
//       });
//     });
//   });
// }

// /** 브레드크럼 카테고리1 경로 클릭 핸들러 */
// export function handleSetupBreadcrumb(state, render) {
//   document.querySelectorAll('button[data-breadcrumb="category1"]').forEach((btn) => {
//     btn.addEventListener("click", () => {
//       updateUrlParams((params) => {
//         params.delete("category2");
//       });

//       fetchAndSetProducts(state, render, {
//         page: 1,
//         limit: parseInt(state.selectedLimit, 10),
//         search: state.search,
//         sort: state.selectedSort,
//         category1: state.category1,
//         category2: "",
//       });
//     });
//   });
// }

// // 상품 개수 변경 핸들러
// export function limitHandler(state, render) {
//   const limitSelect = document.getElementById("limit-select");
//   if (!limitSelect) return;

//   limitSelect.addEventListener("change", async (event) => {
//     const selectedLimit = event.target.value;
//     state.selectedLimit = selectedLimit; // 여기

//     const url = new URL(window.location.href);
//     const params = url.searchParams;
//     if (selectedLimit) {
//       params.set("limit", selectedLimit);
//     } else {
//       params.delete("limit");
//     }
//     window.history.replaceState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`);

//     state.page = 1;
//     state.loading = true;
//     render();

//     const data = await getProducts({
//       page: state.page,
//       limit: state.selectedLimit,
//       search: state.search,
//       category1: state.category1,
//       category2: state.category2,
//       sort: state.selectedSort,
//     });

//     state.allLoaded = false;
//     state.products = data.products;
//     state.total = data.pagination.total;
//     state.loading = false;
//     state.allLoaded = state.products.length >= data.pagination.total;

//     render();
//   });
// }

// // 상품 정렬 변경 핸들러
// export function sortHandler(state, render) {
//   const sortSelect = document.getElementById("sort-select");
//   if (!sortSelect) return;

//   sortSelect.addEventListener("change", async (event) => {
//     const selectedSort = event.target.value;
//     state.selectedSort = selectedSort;

//     // URL 쿼리스트링 업데이트
//     const url = new URL(window.location.href);
//     const params = url.searchParams;
//     if (selectedSort) {
//       params.set("sort", selectedSort);
//     } else {
//       params.delete("sort");
//     }
//     window.history.replaceState({}, "", `${url.pathname}${params.toString() ? `?${params}` : ""}`);

//     // 초기화 후 렌더링
//     state.page = 1;
//     state.loading = true;
//     render();

//     const data = await getProducts({
//       page: state.page,
//       limit: state.selectedLimit,
//       search: state.search,
//       category1: state.category1,
//       category2: state.category2,
//       sort: state.selectedSort,
//     });

//     state.products = data.products;
//     state.total = data.pagination.total;
//     state.loading = false;
//     state.allLoaded = state.products.length >= data.pagination.total;

//     render();
//   });
// }
