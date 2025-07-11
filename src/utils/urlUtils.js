import { BASE_PATH } from "../config/path";
import createReactiveState from "./reactiveState";

const actions = { UPDATE_URL: "UPDATE_URL" };

export default function navigateTo(to, qs) {
  const currentUrl = new URL(location.href);
  if (to.startsWith("/")) {
    currentUrl.pathname = `${BASE_PATH}${to}`;
  } else {
    currentUrl.pathname += to;
  }

  if (qs) currentUrl.searchParams = new URLSearchParams(qs);

  history.pushState(null, "", currentUrl);
  window.dispatchEvent(new CustomEvent(actions.UPDATE_URL));
}

function onSearchParamChange() {
  const state = createReactiveState();

  (function init() {
    window.addEventListener(actions.UPDATE_URL, () => {
      state.updateState(location);
    });

    window.addEventListener("popstate", () => {
      state.updateState(location);
    });

    window.dispatchEvent(new CustomEvent(actions.UPDATE_URL));
  })();

  return state;
}
export const onChangeUrl = onSearchParamChange();
