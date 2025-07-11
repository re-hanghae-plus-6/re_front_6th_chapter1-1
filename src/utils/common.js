// 세자리 숫자마다 , 삽입
export function formatPrice(price) {
  const num = Number(String(price).replace(/,/g, ""));
  if (isNaN(num)) return "0";
  return Math.floor(num).toLocaleString();
}
