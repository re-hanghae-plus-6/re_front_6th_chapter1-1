export const navigate = (path) => {
  history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
