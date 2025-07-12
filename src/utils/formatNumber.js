export function formatPrice(number) {
  let numericNumber = number;
  if (typeof number === "string") {
    numericNumber = Number(number);
  }

  return numericNumber.toLocaleString();
}
