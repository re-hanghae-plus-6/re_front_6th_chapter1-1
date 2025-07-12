export function getQueryParam(paramName, defaultValue) {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(paramName) || defaultValue;
}
