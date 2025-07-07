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
  constructor(loadMore, options = { threshold: 200, delay: 100 }) {
    this.loadMore = loadMore;
    this.threshold = options.threshold || 200;
    this.delay = options.delay || 100;
    this.isLoading = false;
    this.hasMore = true;

    this.handleScroll = throttle(() => {
      this.checkScroll();
    }, this.delay);
  }

  init() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }

  checkScroll() {
    if (this.isLoading || !this.hasMore) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - this.threshold) {
      this.load();
    }
  }

  async load() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    try {
      const hasMoreData = await this.loadMore(false);
      this.hasMore = hasMoreData;
    } catch (error) {
      console.error("로딩 실패:", error);
    } finally {
      this.isLoading = false;
    }
  }

  setHasMore(value) {
    this.hasMore = value;
  }

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
}
