import Layout from "../components/Layout";
import routes from "../routes";

const useRender = () => {
  const init = () => {
    document.querySelector("#root").innerHTML = Layout();
  };
  const draw = (tag, html) => {
    // document.querySelector("#root").innerHTML = Layout();
    document.querySelector(tag).innerHTML = html;
  };

  const view = async () => {
    for (const route of routes) {
      const match = window.location.pathname.match(route.path);
      if (!match) continue;
      const Page = route.component;
      Page.init?.(match?.[1]);
      draw("main", Page({}));
      await Page.mount?.();
      return; // 매치된 첫 번째 라우트만 실행하고 멈추게
    }
  };

  return { init, draw, view };
};

export default useRender;
