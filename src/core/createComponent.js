export function createComponent({ setup, render, onMount, onUnmount }) {
  let context = {};
  let isMounted = false;

  return {
    mount(target) {
      context = setup?.() || {};
      target.innerHTML = render(context);
      onMount?.(context);
      isMounted = true;
    },

    unmount() {
      if (!isMounted) return;
      onUnmount?.(context);
      context?.cleanup?.();
      context = {};
      isMounted = false;
    },
  };
}
