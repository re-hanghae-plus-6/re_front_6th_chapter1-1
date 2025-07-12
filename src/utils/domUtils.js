/**
 * DOM 요소의 innerHTML을 안전하게 업데이트
 * @param {string} selector - CSS 선택자
 * @param {string} html - 새로운 HTML 내용
 */
export const updateElement = (selector, html) => {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = html;
  }
};

/**
 * HTML 템플릿으로 DOM 요소 생성
 * @param {string} template - HTML 템플릿 문자열
 * @returns {HTMLElement} 생성된 DOM 요소
 */
export const createElement = (template) => {
  const el = document.createElement("div");
  el.innerHTML = template.trim();
  return el;
};

/**
 * 구조화된 컴포넌트 생성
 * @param {Function} render - 템플릿 렌더링 함수
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} options - 라이프사이클 옵션 { mount, unmount, setupEvent }
 * @returns {Object} 컴포넌트 객체 { element, mount, unmount, render }
 */
export const createComponent = (render, props, { mount, unmount, setupEvent }) => {
  const el = createElement(render(props));

  let observer = null;

  const componentMount = () => {
    mount?.();
    setupEvent?.(el);

    observer = new MutationObserver(() => {
      unmount?.();
      observer?.disconnect();
    });
  };

  const componentUnmount = () => {
    unmount?.();
    observer?.disconnect();
  };

  const componentRender = () => {
    return render(props);
  };

  return {
    element: el,
    mount: componentMount,
    unmount: componentUnmount,
    render: componentRender,
  };
};
