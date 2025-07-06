import { 상품목록_레이아웃_로딩 } from "./components/productList/publish/상품목록_레이아웃_로딩.js";
import { 상품목록_레이아웃_로딩완료 } from "./components/productList/publish/상품목록_레이아웃_로딩완료.js";
import { 상품목록_레이아웃_카테고리_1Depth } from "./components/productList/publish/상품목록_레이아웃_카테고리_1Depth.js";
import { 상품목록_레이아웃_카테고리_2Depth } from "./components/productList/publish/상품목록_레이아웃_카테고리_2Depth.js";
import { 토스트 } from "./components/toast/토스트.js";
import { 장바구니_비어있음 } from "./components/cart/장바구니_비어있음.js";
import { 장바구니_선택없음 } from "./components/cart/장바구니_선택없음.js";
import { 장바구니_선택있음 } from "./components/cart/장바구니_선택있음.js";
import { 상세페이지_로딩 } from "./components/detail/상세페이지_로딩.js";
import { 상세페이지_로딩완료 } from "./components/detail/상세페이지_로딩완료.js";
import { _404_ } from "./components/404/_404_.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const root = document.getElementById("root");
  root.innerHTML = `
    ${상품목록_레이아웃_로딩}
    <br />
    ${상품목록_레이아웃_로딩완료}
    <br />
    ${상품목록_레이아웃_카테고리_1Depth}
    <br />
    ${상품목록_레이아웃_카테고리_2Depth}
    <br />
    ${토스트}
    <br />
    ${장바구니_비어있음}
    <br />
    ${장바구니_선택없음}
    <br />
    ${장바구니_선택있음}
    <br />
    ${상세페이지_로딩}
    <br />
    ${상세페이지_로딩완료}
    <br />
    ${_404_}
  `;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
