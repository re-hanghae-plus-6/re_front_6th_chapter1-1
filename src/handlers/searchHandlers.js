import { updateURL } from "../utils/url.js";
import { updateProducts } from "../services/productService.js";

export const handleSearchSubmit = async () => {
  const searchInput = document.getElementById("search-input");

  if (searchInput) {
    const search = searchInput.value.trim();
    console.log("Search submitted:", search);
    updateURL({ search }); // encodeURIComponent 제거 - updateURL에서 자동으로 인코딩됨
    await updateProducts({ search });
  }
};

export const handleSearchKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearchSubmit();
  }
};
