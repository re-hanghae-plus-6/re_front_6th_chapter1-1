export const objectToQueryString = (obj) => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};

export const queryStringToObject = (queryString) => {
  return queryString
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = value;
      return acc;
    }, {});
};
