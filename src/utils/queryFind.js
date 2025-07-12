import { filterState, pageState } from "../pages/productPage";

export function getQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
}

export function updateURLFilters() {
  const params = new URLSearchParams({
    search: filterState.search,
    sort: filterState.sort,
    category1: filterState.category1,
    category2: filterState.category2,
    limit: pageState.limit,
    page: pageState.page,
  });

  const newUrl = `/?${params.toString()}`;
  history.pushState(null, "", newUrl);
}
