export const getUrlSegment = (pathname, index) => {
  const segments = pathname.split("/").filter((segment) => segment !== "");
  return segments[index] || null;
};

export const getProductId = (pathname) => {
  return getUrlSegment(pathname, 1);
};

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: params.get("limit") || "20",
    sort: params.get("sort") || "price_asc",
    search: params.get("search") || "",
    category1: params.get("category1") || "",
    category2: params.get("category2") || "",
  };
};

export const updateQueryParams = (params) => {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, "", url.toString());
};
