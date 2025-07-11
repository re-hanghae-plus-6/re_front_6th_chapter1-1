import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { afterAll, beforeAll } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";

configure({
  asyncUtilTimeout: 5000,
});

global.IntersectionObserver = class {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe(element) {
    // 무조건 isIntersecting = true
    this.callback([{ isIntersecting: true, target: element }], this);
  }

  unobserve() {}
  disconnect() {}
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});
