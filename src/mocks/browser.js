import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { BASE } from "../main";

// MSW 워커 설정
export const worker = setupWorker(...handlers);

// Worker start 옵션을 export하여 main.js에서 사용
export const workerOptions = import.meta.env.PROD
  ? {
      serviceWorker: {
        url: `${BASE.slice(0, -1)}/mockServiceWorker.js`,
      },
      onUnhandledRequest: "bypass",
    }
  : {
      onUnhandledRequest: "bypass",
    };
