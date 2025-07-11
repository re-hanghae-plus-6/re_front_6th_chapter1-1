import { state as State, render as mainRender } from "../main.js";

const triggerRender = () => {
  mainRender(State);
};

// 특정 id 를 클릭하면, 아래 처럼 어떤 페이지를 불러올것인지 (2번째 인자에)
window.addEventListener("popstate", triggerRender);

// a href 에 따라 url 변경 -> 그러면 4번째 줄 코드 호출

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
// const BASE_PATH = "/front_6th_chapter1-1";
const router = {
  navigateTo: (path) => {
    window.history.pushState({}, "", `${BASE_PATH}${path}`);
    triggerRender();
  },
};

export default router;
