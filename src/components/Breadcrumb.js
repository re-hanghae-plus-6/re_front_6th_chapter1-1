import { store } from "../main";

Breadcrumb.mount = () => {
  const categoryAllBtn = document.querySelector("button[data-breadcrumb='reset']");
  const category1Btn = document.querySelector("button[data-breadcrumb='category1']");

  categoryAllBtn.addEventListener("click", () => {
    store.set("params.category1", "");
    store.set("params.category2", "");
  });

  category1Btn?.addEventListener("click", () => {
    store.set("params.category2", "");
  });
};

export default function Breadcrumb() {
  const category1 = store.get("params")["category1"];
  const category2 = store.get("params")["category2"];

  return /* html */ `              
    <label class="text-sm text-gray-600" >카테고리:</label>
    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
    ${
      category1
        ? /* html */ `
        <span class="text-xs text-gray-500">&gt;</span>
        <button data-breadcrumb="category1" data-category1="${category1}" class="text-xs hover:text-blue-800 hover:underline">${category1}</button>
      `
        : ""
    }
    ${
      category2
        ? /* html */ `
        <span class="text-xs text-gray-500">&gt;</span>
        <button data-breadcrumb="category2" data-category1="${category2}" class="text-xs hover:text-blue-800 hover:underline">${category2}</button>
      `
        : ""
    }
  `;
}
