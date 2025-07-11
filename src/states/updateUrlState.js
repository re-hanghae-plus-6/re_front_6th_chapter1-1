export function updateUrlState(state) {
  const params = new URLSearchParams();

  if (state.search) params.set("search", state.search);
  if (state.sort && state.sort !== "price_asc") params.set("sort", state.sort);
  if (state.limit && state.limit !== "20") params.set("limit", state.limit);
  if (state.category1) params.set("category1", state.category1);
  if (state.category2) params.set("category2", state.category2);
  if (state.page && state.page !== 1) params.set("page", state.page);

  const queryString = params.toString();
  const newUrl = queryString ? `${location.pathname}?${queryString}` : `${location.pathname}`;

  history.replaceState(null, "", newUrl);
}
