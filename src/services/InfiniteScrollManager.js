class InfiniteScrollManager {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.threshold = options.threshold ?? 200; // px before bottom
    this.loading = false;
    this.attached = false;
    this.onScroll = this.onScroll.bind(this);
  }

  attach() {
    if (this.attached) return;
    window.addEventListener("scroll", this.onScroll);
    this.attached = true;
  }

  detach() {
    if (!this.attached) return;
    window.removeEventListener("scroll", this.onScroll);
    this.attached = false;
  }

  async onScroll() {
    if (this.loading) return;
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - this.threshold;
    if (nearBottom) {
      this.loading = true;
      try {
        await this.callback();
      } finally {
        this.loading = false;
      }
    }
  }
}

export default InfiniteScrollManager;
