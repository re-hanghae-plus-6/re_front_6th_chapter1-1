import { 상품목록_레이아웃_카테고리_0Depth } from "./category-depth0.ts";
import { 상품목록_레이아웃_카테고리_1Depth } from "./category-depth1.ts";
import { 상품목록_레이아웃_카테고리_2Depth } from "./category-depth2.ts";

export type CategoryState =
  | { depth: 0 }
  | { depth: 1; category1: string }
  | { depth: 2; category1: string; category2: string };

export type Categories = Record<string, Record<string, unknown>>;

export const 상품목록_레이아웃_카테고리 = (state: CategoryState, categories: Categories): string => {
  if (!categories || Object.keys(categories).length === 0) {
    return ""; // 데이터가 아직 없을 때는 비워둔다.
  }

  switch (state.depth) {
    case 0:
      return 상품목록_레이아웃_카테고리_0Depth(categories);
    case 1:
      if (!categories[state.category1]) {
        return ""; // 잘못된 상태면 빈 문자열 반환
      }
      return 상품목록_레이아웃_카테고리_1Depth(state.category1, categories[state.category1]);
    case 2:
      if (!categories[state.category1]) {
        return ""; // 잘못된 상태면 빈 문자열 반환
      }
      return 상품목록_레이아웃_카테고리_2Depth(state.category1, state.category2, categories[state.category1]);
    default:
      return "";
  }
};
