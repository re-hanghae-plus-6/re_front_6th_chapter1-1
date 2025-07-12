import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { afterAll, beforeAll } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";

// Mock IntersectionObserver for Vitest/JSDOM
defineIntersectionObserverMock();

function defineIntersectionObserverMock() {
  if (typeof window !== "undefined" && !window.IntersectionObserver) {
    class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    window.IntersectionObserver = IntersectionObserver;
    window.IntersectionObserverEntry = function () {};
  }
}

configure({
  asyncUtilTimeout: 5000,
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});
