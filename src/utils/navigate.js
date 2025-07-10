import { renderHtml } from "./renderHtml";

export const navigate = (path) => {
  window.history.pushState({}, "", path);
  renderHtml();
};
