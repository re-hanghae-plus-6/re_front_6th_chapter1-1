import { loadMoreProducts } from "../services/productService.js";

export const setupInfiniteScroll = () => {
  const handleScroll = () => {
    // 스크롤이 바닥에서 200px 이내에 도달했을 때
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      loadMoreProducts();
    }
  };

  // 기존 이벤트 리스너 제거
  window.removeEventListener("scroll", handleScroll);
  // 새 이벤트 리스너 추가
  window.addEventListener("scroll", handleScroll);
};
