/**
 * 숫자를 천 단위로 콤마를 추가하여 포맷팅하는 함수
 * @param {number|string} number - 포맷팅할 숫자
 * @returns {string} 콤마가 추가된 숫자 문자열
 */
export function formatPrice(number) {
  // 숫자가 아닌 경우 그냥 0 반환 처리
  if (number === null || number === undefined) return "0";

  // 숫자가 아닌 경우 문자열에서 숫자만 추출
  const numStr = String(number).replace(/[^0-9]/g, "");
  const num = parseInt(numStr);

  if (isNaN(num)) return "0";

  return num.toLocaleString("ko-KR");
}
