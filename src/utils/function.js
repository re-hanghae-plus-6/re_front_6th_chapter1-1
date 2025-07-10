export function formatNumber(point) {
  const _ = new Intl.NumberFormat();

  return _.format(typeof point === "string" ? +point : point);
}
