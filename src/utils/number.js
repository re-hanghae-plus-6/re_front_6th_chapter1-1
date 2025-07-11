export function localeStringToNumber(value) {
  return Number(value.replace("원", "").replace(/,/g, ""));
}
