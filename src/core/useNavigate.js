import { render } from "../main";
import { getFullPath } from "../main";

const useNavigate = () => {
  const push = (state = {}, url) => {
    const fullUrl = getFullPath(url);
    window.history.pushState(state, "", fullUrl);

    render.view();
  };

  return { push };
};

export default useNavigate;
