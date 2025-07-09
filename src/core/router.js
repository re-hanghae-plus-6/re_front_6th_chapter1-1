class Router {
  #pagesMap = new Map();
  #pageDispose;
  #currentParams;
  #root = "#root";

  addPage(pathname, page) {
    this.#pagesMap.set(pathname, page);
    return this;
  }

  init({ _404 = null } = {}) {
    this._404 = _404;
    this.#setEvents();
    this.#navigateTo();
  }

  push({ pathname = location.pathname, params = {} } = {}) {
    this.#updateUrl({ type: "pushState", pathname, params });
    this.#navigateTo({ pathname, params });
  }

  replace({ pathname = location.pathname, params = {} } = {}) {
    this.#updateUrl({ type: "replaceState", pathname, params });
    this.#navigateTo({ pathname, params });
  }

  updateParams(params) {
    this.#updateUrl({ type: "replaceState", pathname: location.pathname, params });
  }

  getParams() {
    return this.#currentParams;
  }

  #setEvents() {
    window.addEventListener("popstate", () => {
      const params = Object.fromEntries(new URLSearchParams(location.search));
      this.#navigateTo(location.pathname, params);
    });
  }

  #navigateTo({ pathname = location.pathname, params = {} } = {}) {
    if (this.#pageDispose) {
      this.#pageDispose();
    }

    this.#currentParams = params;
    const page = this.#matchPage({ pathname, params });

    if (page) {
      this.#pageDispose = page(this.#root);
    } else {
      this.#pageDispose = this._404(this.#root);
    }
  }

  #matchPage({ pathname = location.pathname, params = {} } = {}) {
    if (this.#pagesMap.has(pathname)) {
      return this.#pagesMap.get(pathname);
    }

    const pathnameSegments = pathname.split("/");
    for (const [pagePathnameSegments, page] of this.#pagesMap.entries()) {
      const pagePathnameParts = pagePathnameSegments.split("/");
      if (pagePathnameParts.length !== pathnameSegments.length) {
        continue;
      }

      let match = true;

      for (let i = 0; i < pagePathnameParts.length; i++) {
        if (pagePathnameParts[i].startsWith(":")) {
          this.#currentParams = { ...this.#currentParams, [pagePathnameParts[i].slice(1)]: pathnameSegments[i] };
          continue;
        }

        if (pagePathnameParts[i] !== pathnameSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        this.#currentParams = { ...this.#currentParams, ...params };
        return page;
      }
    }

    return null;
  }

  #updateUrl({ type = "pushState", pathname = location.pathname, params = {} } = {}) {
    const url = new URL(pathname, location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history[type]({}, "", url);
  }
}

export const router = new Router();
