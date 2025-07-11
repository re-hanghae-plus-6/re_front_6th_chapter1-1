// 가격을 통화 형식으로 변환하는 함수
export const formatCurrency = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
