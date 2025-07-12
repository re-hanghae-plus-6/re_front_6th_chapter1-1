import { throttle } from "../utils/throttle";

export class InfiniteScroll {
  /**
   * @param {Object} options
   * @param {Window|Element} [options.container=window] 스크롤 컨테이너
   * @param {number} [options.threshold=100] 바닥에서 호출되는 임계 픽셀
   * @param {Function} options.onLoad 추가 데이터를 불러오는 콜백
   */
  constructor({ container = window, threshold = 100, onLoad }) {
    this.container = container;
    this.threshold = threshold;
    this.onLoad = onLoad;
    this.handleScroll = throttle(this.#onScroll.bind(this), 100);
  }

  init() {
    this.container.addEventListener("scroll", this.handleScroll);
  }

  destroy() {
    this.container.removeEventListener("scroll", this.handleScroll);
  }

  #onScroll() {
    const scrollTop = this.#getScrollTop();
    const viewHeight = this.#getViewHeight();
    const scrollHeight = this.#getScrollHeight();

    if (scrollTop + viewHeight + this.threshold >= scrollHeight) {
      this.onLoad();
    }
  }

  #getScrollTop() {
    if (this.container === window) {
      return window.scrollY || document.documentElement.scrollTop;
    }

    if (this.container instanceof Element) {
      return this.container.scrollTop;
    }

    return 0;
  }

  #getViewHeight() {
    if (this.container === window) {
      return window.innerHeight;
    }

    return this.container.clientHeight;
  }

  #getScrollHeight() {
    if (this.container === window) {
      return document.documentElement.scrollHeight;
    }

    return this.container.scrollHeight;
  }
}
