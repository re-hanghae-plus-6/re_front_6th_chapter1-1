import { createElementByString, renderViewComponent } from "../utils/createViewcomponent";

export function DetailPage() {
  const renderer = renderViewComponent({ component: createElementByString("<p>detailpage</p>") });
  renderer.render();
}
