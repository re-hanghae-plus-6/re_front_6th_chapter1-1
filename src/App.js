import { Router } from "./lib/Router";
import { routes } from "./routes";

export default function App() {
  new Router(routes, document.getElementById("root"));
}
