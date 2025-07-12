import getFilter from "./getFilter";

export function getCurrentCategory() {
  const { category1, category2 } = getFilter();

  return category2 || category1 || "";
}
