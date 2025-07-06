export const updateParams = (store, newParams, callback) => {
  const currentParams = store.getState().params;
  const updatedParams = { ...currentParams, ...newParams };

  if (callback) {
    callback(updatedParams);
  }

  return updatedParams;
};
