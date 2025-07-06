export const navigate = (path) => {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
