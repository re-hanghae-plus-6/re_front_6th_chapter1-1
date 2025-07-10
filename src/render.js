import { router } from "./router.js";
import { initEventManager } from "./utils/eventManager.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { Header } from "./app/components/Header.js";

let currentMountedPage = null;
let currentPageComponent = null;
let isHeaderInitialized = false;

export function render() {
  const $root = document.querySelector("#root");

  if (!$root) {
    console.warn("Root element (#root) not found");
    return;
  }

  try {
    const currentRoute = router.get();
    const Page = currentRoute.getTarget() ?? NotFoundPage;
    const routePath = currentRoute.path;

    $root.innerHTML = Page();

    if (!isHeaderInitialized && typeof Header.onMount === "function") {
      Header.onMount();
      isHeaderInitialized = true;
    }

    if (typeof Page.onMount === "function") {
      if (routePath !== currentMountedPage) {
        if (currentMountedPage && currentPageComponent && typeof currentPageComponent.onUnmount === "function") {
          currentPageComponent.onUnmount();
        }

        Page.onMount();
        currentMountedPage = routePath;
        currentPageComponent = Page;
      }
    }
  } catch (error) {
    console.error(error);
    $root.innerHTML = NotFoundPage();
  }

  initEventManager();
}
