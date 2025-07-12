import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const basePath = window.location.hostname === "elli-lee.github.io" ? "/front_6th_chapter1-1" : "";

// MSW 워커 설정
export const worker = setupWorker(...handlers);
export const workerOptions = {
  serviceWorker: {
    url: `${basePath}/mockServiceWorker.js`,
  },
  onUnhandledRequest: "bypass",
};
