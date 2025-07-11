let root = null;
let currentComponent = null;

export const initRootRenderer = (id = "root") => {
  root = document.getElementById(id);

  if (!root) {
    console.log("Root element not found");
  }
};

export const update = (component, onAfterRender) => {
  if (!root) {
    console.error("Root element not found");
    return;
  }

  // 현재 컴포넌트 저장
  currentComponent = component;

  const targetComponent = component();

  root.innerHTML = targetComponent;
  root.offsetHeight; // DOM 강제 리플로우

  // 렌더링 완료 후 콜백 실행
  if (onAfterRender) {
    onAfterRender();
  }
};

// 현재 컴포넌트를 다시 렌더링
export const updateCurrent = (onAfterRender) => {
  if (currentComponent) {
    update(currentComponent, onAfterRender);
  }
};
