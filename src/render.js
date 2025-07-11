import { router } from "./router.js";
import { _404_ } from "./components/404/_404_.js";

export function render() {
  const root = document.getElementById("root");
  const pathname = window.location.pathname;
  const routes = Object.values(router.routes);

  let page;
  for (const route of routes) {
    if (route.regex.test(pathname)) {
      page = route.page;
      break;
    }
  }

  if (page == null) {
    page = _404_;
  }

  root.innerHTML = page();
  page.registerEvent?.();
}
