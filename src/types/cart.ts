export interface CartItem {
  /** 고유 상품 ID */
  id: string;
  /** 수량 */
  qty: number;
  /** 단가(원) */
  price?: number;
  /** 상품명 */
  title?: string;
  /** 썸네일 URL (UI 용) */
  imageUrl?: string;
}
