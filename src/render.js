import { router } from "./router.js";
import { initEventManager } from "./utils/eventManager.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";

export function render() {
  const $root = document.querySelector("#root");

  if (!$root) {
    console.warn("Root element (#root) not found");
    return;
  }

  try {
    const Page = router.get().getTarget() ?? NotFoundPage;
    $root.innerHTML = Page();

    if (typeof Page.onMount === "function") {
      Page.onMount();
    }
  } catch (error) {
    console.error(error);
    $root.innerHTML = NotFoundPage();
  }

  initEventManager();
}
