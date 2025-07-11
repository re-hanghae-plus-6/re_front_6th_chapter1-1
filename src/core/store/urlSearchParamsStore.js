const createUrlSearchParamsStore = () => {
  const listeners = new Set();

  return {
    getParams: () => {
      const params = new URLSearchParams(location.search);
      return Object.fromEntries(params.entries());
    },
    setParams: (params) => {
      const url = new URL(location.href);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, value);
        }
      });

      history.pushState({}, "", url.toString());

      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

const urlSearchParamsStore = createUrlSearchParamsStore();

export default urlSearchParamsStore;
