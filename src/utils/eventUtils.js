import { state, setLimit } from "../store.js";
import { updateURLParams } from "../router.js";
import { getProductList } from "./dataUtils.js";

export function setupEventListeners() {
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.value = state.limit;

    limitSelect.addEventListener("change", (e) => {
      const newLimit = parseInt(e.target.value);
      setLimit(newLimit);
      updateURLParams(newLimit);
      getProductList();
    });
  }
}
