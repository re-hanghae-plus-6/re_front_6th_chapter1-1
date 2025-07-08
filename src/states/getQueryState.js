export function getQueryState() {
  const params = new URLSearchParams(location.search);

  return {
    page: parseInt(params.get("page")) || 1,
    search: params.get("search") || "",
    sort: params.get("sort") || "price_asc",
    limit: parseInt(params.get("limit")) || "20",
    category1: params.get("category1") || "",
    category2: params.get("category2") || "",
  };
}
