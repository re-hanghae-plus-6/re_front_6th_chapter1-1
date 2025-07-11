import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW 워커 설정
export const worker = setupWorker(...handlers);

export const workerOptions = import.meta.PROD
  ? {
      serviceWorker: {
        url: `/front_6th_chapter1-1/mockServiceWorker.js`,
      },
      onUnhandledRequest: "bypass",
    }
  : {
      onUnhandledRequest: "bypass",
    };
