import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { afterAll, beforeAll } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";
import "intersection-observer";

configure({
  asyncUtilTimeout: 5000,
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});
