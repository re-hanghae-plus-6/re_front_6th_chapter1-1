import { _404페이지 } from "../components/not-found/index.ts";
import type { PageModule } from "../router.ts";

export const notFoundPage: PageModule = {
  render: () => {
    return _404페이지();
  },
};
