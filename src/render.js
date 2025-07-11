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

    const pageHTML = typeof Page === "function" ? Page() : Page.render?.() || "";
    $root.innerHTML = pageHTML;

    if (!isHeaderInitialized && typeof Header.mount === "function") {
      Header.mount();
      isHeaderInitialized = true;
    }

    if (routePath !== currentMountedPage) {
      if (currentMountedPage && currentPageComponent) {
        if (typeof currentPageComponent.unmount === "function") {
          currentPageComponent.unmount();
        } else if (typeof currentPageComponent.onUnmount === "function") {
          currentPageComponent.onUnmount();
        }
      }

      if (typeof Page.mount === "function") {
        Page.mount();
        currentPageComponent = Page;
      } else if (typeof Page.onMount === "function") {
        Page.onMount();
        currentPageComponent = Page;
      }

      currentMountedPage = routePath;
    }
  } catch (error) {
    console.error(error);
    $root.innerHTML = NotFoundPage();
  }

  initEventManager();
}
