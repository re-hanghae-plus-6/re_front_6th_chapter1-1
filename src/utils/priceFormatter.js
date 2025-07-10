export const formatPrice = (price) => {
  const numPrice = typeof price === "string" ? parseInt(price, 10) : price;
  return numPrice.toLocaleString("ko-KR");
};
