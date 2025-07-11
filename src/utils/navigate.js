import { getFullPath } from "../router/Router";
import { renderHtml } from "./renderHtml";

export const navigate = (path) => {
  window.history.pushState({}, "", getFullPath(path));
  renderHtml();
};
