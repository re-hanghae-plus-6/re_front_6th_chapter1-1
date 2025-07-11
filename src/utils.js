export function throttle(fn, delay) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, delay);
    }
  };
}

export class InfiniteScroll {
  constructor(loadMore, options = { threshold: 400, delay: 100 }) {
    this.loadMore = loadMore;
    this.threshold = options.threshold;
    this.delay = options.delay;
    this.isLoading = false;
    this.hasNext = options.hasNext !== undefined ? options.hasNext : true;

    this.handleScroll = throttle(() => {
      this.checkScroll();
    }, this.delay);
  }

  init() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }

  checkScroll() {
    if (this.isLoading || !this.hasNext) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - this.threshold) {
      this.load();
    }
  }

  async load() {
    if (this.isLoading || !this.hasNext) return;

    this.isLoading = true;

    try {
      const hasNextData = await this.loadMore(false);
      this.hasNext = hasNextData;
    } catch (error) {
      console.error("로딩 실패:", error);
    } finally {
      this.isLoading = false;
    }
  }

  sethasNext(value) {
    this.hasNext = value;
  }

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
}

export class LocalStorage {
  constructor(key) {
    this.key = key;
  }

  get() {
    return JSON.parse(localStorage.getItem(this.key));
  }

  set(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  remove() {
    localStorage.removeItem(this.key);
  }
}

export const CartStorage = new LocalStorage("cart");
