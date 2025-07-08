import { store } from "../store/store";
import { getProducts } from "../api/productApi.js";
const infiniteStore = store;
let unsubscribe = null;
let currentPage = 1;
export function infiniteScroll() {
  const callback = (entries) => {
    entries.forEach(async (entry) => {
      //isIntersecting: 관찰 대상의 교차 상태 (Boolean)
      if (entry.isIntersecting) {
        currentPage++;
        console.log("currentPage =>", currentPage);

        try {
          const queryParams = new URLSearchParams(window.location.search);

          const size = queryParams.get("limit");
          const sort = queryParams.get("sort");
          const response = await getProducts({
            page: currentPage, // current 대신 page 사용
            limit: size,
            sort: sort,
          });

          console.log("✅ API 응답:", response);

          const existingProducts = infiniteStore.state.products;
          const newProducts = response.products;

          const combinedProducts = [...existingProducts, ...newProducts];

          infiniteStore.setProducts(combinedProducts);
        } catch (error) {
          console.log("error =>", error);
        }
      }
    });
  };
  const io = new IntersectionObserver(callback, { threshold: 0.7 });

  const productList = document.querySelectorAll(".product-card");

  io.observe(productList[productList.length - 1]);
}

export function cleanupInfiniteScroll() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}
