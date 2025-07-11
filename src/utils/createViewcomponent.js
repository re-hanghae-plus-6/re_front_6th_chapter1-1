export function renderViewComponent({ parent = document.body, component }) {
  let currentView = null;

  return {
    render(props) {
      if (!currentView) {
        currentView = component(props);
        parent.appendChild(currentView);
      } else {
        const newView = component(props);
        parent.replaceChild(newView, currentView);
        currentView = newView;
      }
    },
  };
}

export const createElementByString = (string) => {
  const template = document.createElement("template");
  template.innerHTML = string;

  return template.content.firstElementChild;
};
