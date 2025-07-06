import Product from "../pages/Product";
import Products from "../pages/Products";

const ROOT_PATH = "/";

class Router {
  #routes;

  constructor() {
    this.#routes = {};
    window.addEventListener("popstate", this.handlePopState.bind(this));
  }

  getInitialRoute() {
    return this.#routes[window.location.pathname];
  }

  addRoute({ path, view, children }) {
    if (children == null) {
      this.#routes[path] = {
        path,
        view,
      };
      return;
    }

    if (!Array.isArray(children)) {
      throw new Error("children must be an array");
    }

    this.#routes[path] = {
      path,
      view,
    };

    for (const child of children) {
      this.addRoute({
        ...child,
        path: this.isRootPath(path) ? child.path : `${path}${child.path}`,
      });
    }
  }

  navigate(path) {
    window.history.pushState({ path }, "", path);
    this.handlePopState();
  }

  handlePopState(event) {
    const path = event.state?.path || ROOT_PATH;
    const view = this.#routes[path];
    view.render();
  }

  isRootPath(path) {
    return path === ROOT_PATH;
  }
}

const router = new Router();

router.addRoute({
  path: "/",
  view: Products(),
  children: [
    {
      path: "/detail",
      view: Product(),
    },
  ],
});

export { router };
