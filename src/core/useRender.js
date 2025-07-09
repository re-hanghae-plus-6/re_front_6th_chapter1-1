import routes from "../routes";
import useNavigate from "./useNavigate";

const useRender = () => {
  const navigate = useNavigate();

  const draw = (tag, html) => {
    document.querySelector(tag).innerHTML = html;
  };

  const view = async () => {
    for (const route of routes) {
      const match = navigate.getCurrentUrl().match(route.path);
      if (!match) continue;
      const Page = route.component;
      Page.init?.(match?.[1]);
      draw("main", Page({}));
      await Page.mount?.();
      return; // 매치된 첫 번째 라우트만 실행하고 멈추게
    }
  };

  return { draw, view };
};

export default useRender;
