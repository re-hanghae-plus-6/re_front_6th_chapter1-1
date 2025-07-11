// productHandlers.js
import { getProducts } from "../api/productApi.js";
import { navigateTo } from "../router/router.js";

/** 무한 스크롤 */
export function infinityScrollHandler(state, render) {
  //스크롤 이벤트 중복 실행 방지
  let ticking = false;

  window.onscroll = async () => {
    if (ticking || state.isLoading || state.allLoaded) return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    // 하단에서 300px 이내일 때 로드
    if (scrollTop + viewportHeight >= fullHeight - 200) {
      ticking = true;
      state.page++;
      state.isLoading = true;
      render();

      const data = await getProducts({
        page: state.page,
        limit: parseInt(state.selectedLimit, 10),
        search: state.search,
        category1: state.selectedCategory1,
        category2: state.selectedCategory2,
        sort: state.selectedSort,
      });

      state.products = [...state.products, ...data.products];
      state.total = data.pagination.total;
      state.allLoaded = state.products.length >= data.pagination.total;
      state.isLoading = false;

      render();
      ticking = false;
    }
  };
}
/** 상품 디테일 페이지 이동 */
document.onclick = (e) => {
  const target = e.target.closest(".product-image, .product-info");
  if (target) {
    const productId = target.closest(".product-card")?.dataset.productId;
    if (productId) {
      navigateTo(`/product/${productId}`);
    }
  }
};
