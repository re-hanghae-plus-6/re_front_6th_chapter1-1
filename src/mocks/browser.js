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

console.log("workerOptions", workerOptions);

console.log("BASE", BASE);

console.log("BASE.slice(0, -1)", BASE.slice(0, -1));

console.log("import.meta.env.PROD", import.meta.env.PROD);

console.log("import.meta.env.MODE", import.meta.env.MODE);

console.log("url", `${BASE.slice(0, -1)}/mockServiceWorker.js`);
