export const ROUTE_ACTIONS = {
  NAVIGATE: "NAVIGATE",
};

export const navigate = (path) => ({
  type: ROUTE_ACTIONS.NAVIGATE,
  payload: path,
});
