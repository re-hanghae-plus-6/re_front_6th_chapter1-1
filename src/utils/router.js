const Router = () => {
  const routes = {};

  // 라우트 추가 함수
  function addRoute(path, component) {
    routes[path] = component;
  }
  // 페이지 이동 함수
  function navigate(path) {
    const component = routes[path] || routes["/"];

    document.getElementById("root").innerHTML = component.render();

    if (component.setup) {
      console.log("✅ setup 호출됨!");
      component.setup();
    }
  }

  function init() {
    window.addEventListener("popstate", () => {
      navigate(window.location.pathname);
    });
  }

  return {
    addRoute,
    init,
    navigate,
  };
};

export default Router;
