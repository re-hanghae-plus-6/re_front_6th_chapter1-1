export function getQueryState({ resetPage = false } = {}) {
  const params = new URLSearchParams(location.search);

  return {
    page: resetPage ? 1 : parseInt(params.get("page")),
    search: params.get("search") || "",
    sort: params.get("sort") || "price_asc",
    limit: parseInt(params.get("limit")) || "20",
    category1: params.get("category1") || "",
    category2: params.get("category2") || "",
  };
}
