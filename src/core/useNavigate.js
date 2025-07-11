import { render } from "../main";

const useNavigate = () => {
  const push = (state = {}, url) => {
    window.history.pushState(state, "", url);

    render.view();
  };

  return { push };
};

export default useNavigate;
