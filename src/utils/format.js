// 가격을 천단위 쉼표가 포함된 형태로 포맷팅
export function formatPrice(price) {
  if (typeof price === "string") {
    price = parseInt(price, 10);
  }
  return price.toLocaleString() + "원";
}

// 숫자만 천단위 쉼표 포맷팅 (원 제외)
export function formatNumber(num) {
  if (typeof num === "string") {
    num = parseInt(num, 10);
  }
  return num.toLocaleString();
}
