import { router } from "./router.js";
import { _404_ } from "./components/404/_404_.js";

export function render() {
  const root = document.getElementById("root");
  const pathname = window.location.pathname;
  let { page } = router.routes[pathname] ?? {};

  if (page == null) {
    page = _404_;
  }

  root.innerHTML = page();
  page.registerEvent?.();
}
