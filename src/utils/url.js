export function updateURLParams(newParams) {
  const url = new URL(window.location);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value && value !== "") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.replaceState(null, "", url.toString());
}
