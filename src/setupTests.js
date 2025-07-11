import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { vi, afterAll, beforeAll } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";

configure({
  asyncUtilTimeout: 5000,
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

  const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }));

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterAll(() => {
  server.close();
});
