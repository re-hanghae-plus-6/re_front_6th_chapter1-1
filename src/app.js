import { getRouteConfig } from "./routes.js";
import { Layout } from "./components/layout.js";
import { store } from "./store.js";

export const App = () => {
  const state = store.getState();
  const { currentRoute } = state;

  const routeConfig = getRouteConfig(currentRoute);
  const { component: PageComponent, headerType } = routeConfig;

  const pageContent = PageComponent();

  return Layout({
    headerType,
    children: pageContent,
  });
};
