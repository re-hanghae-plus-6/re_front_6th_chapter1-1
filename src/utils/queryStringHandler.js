export const getQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
};

export const updateQueryParams = (newParams, replace = true) => {
  const currentParams = getQueryParams();
  const updatedParams = { ...currentParams, ...newParams };

  // 빈 값들은 제거
  Object.keys(updatedParams).forEach((key) => {
    if (updatedParams[key] === "" || updatedParams[key] === null || updatedParams[key] === undefined) {
      delete updatedParams[key];
    }
  });

  const searchParams = new URLSearchParams(updatedParams);
  const newUrl = `${window.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
};

export const removeQueryParams = (paramsToRemove) => {
  const currentParams = getQueryParams();
  const paramsArray = Array.isArray(paramsToRemove) ? paramsToRemove : [paramsToRemove];

  paramsArray.forEach((param) => {
    delete currentParams[param];
  });

  const searchParams = new URLSearchParams(currentParams);
  const newUrl = `${window.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

  window.history.replaceState({}, "", newUrl);
};

export const syncStateFromQuery = (state) => {
  const params = getQueryParams();

  return {
    ...state,
    page: parseInt(params.page) || 1,
    limit: parseInt(params.limit) || 20,
    sort: params.sort || "price_asc",
    search: params.search || "",
    category1: params.category1 || "",
    category2: params.category2 || "",
  };
};
