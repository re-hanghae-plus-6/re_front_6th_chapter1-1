export function renderViewComponent({ parent = document.body, component: propsComponent }) {
  let currentView = null;
  let component = propsComponent;

  return {
    unmount() {
      if (currentView) parent.removeChild(currentView);
      currentView = null;
      component = null;
    },
    render(props) {
      if (!currentView) {
        currentView = component(props);
        parent.appendChild(currentView);
      } else {
        const newView = component(props);
        parent.replaceChild(newView, currentView);
        this.currentView = newView;
      }
      return parent;
    },
    updateComponent(newComponent) {
      this.unmount();
      component = newComponent;
      return this;
    },
  };
}

export const createElementByString = (string) => {
  const template = document.createElement("template");
  template.innerHTML = string;

  return template.content.firstElementChild;
};
