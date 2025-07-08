import Home from "./pages/Home.js";
import NotFound from "./pages/NotFound.js";

const routes = {
  "/": Home,
  "*": NotFound,
};

const componentInstances = {};

export function router() {
  const path = window.location.pathname;
  const route = routes[path] || routes["*"];

  if (componentInstances.current && componentInstances.current.cleanup) {
    componentInstances.current.cleanup();
  }

  const component = route();

  const root = document.getElementById("root");
  if (!root) {
    return;
  }

  if (component && component.template && component.mount) {
    root.innerHTML = component.template;

    const cleanup = component.mount();

    componentInstances.current = { cleanup };
  } else {
    root.innerHTML = component;
  }
}
