export const getURLParams = (defaults = {}) => {
  const url = new URL(window.location);
  const params = {};

  Object.keys(defaults).forEach((key) => {
    const value = url.searchParams.get(key);
    if (value !== null) {
      const defaultValue = defaults[key];
      if (typeof defaultValue === "number") {
        params[key] = parseInt(value) || defaultValue;
      } else {
        params[key] = value;
      }
    } else {
      params[key] = defaults[key];
    }
  });

  return params;
};

export const updateURLParams = (newParams, defaults = {}, callback) => {
  const url = new URL(window.location);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.pushState({}, "", url);

  if (callback) {
    callback(getURLParams(defaults));
  }
};
