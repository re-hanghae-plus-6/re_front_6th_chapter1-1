import createReactiveState from "./reactiveState";

const actions = { UPDATE_URL: "UPDATE_URL" };

export default function navigateTo(to, qs) {
  const currentUrl = new URL(location.href);
  if (to.startsWith("/")) {
    currentUrl.pathname = to;
  } else {
    currentUrl.pathname += to;
  }

  if (qs) currentUrl.searchParams = new URLSearchParams(qs);

  history.pushState(null, "", currentUrl);
  window.dispatchEvent(new CustomEvent(actions.UPDATE_URL));
}

function onSearchParamChange() {
  const state = createReactiveState();

  let runInit = false;
  (function init() {
    if (!runInit) {
      window.addEventListener(actions.UPDATE_URL, () => {
        state.updateState(location);
      });
      window.dispatchEvent(new CustomEvent(actions.UPDATE_URL));

      runInit = true;
    }
  })();

  return state;
}
export const onChangeUrl = onSearchParamChange();
