import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { screen } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import stateManager from "../state/index.js";
import { server } from "./mockServerHandler.js";

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

beforeAll(async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await import("../main.js");
});

beforeEach(() => goTo("/"));

afterEach(() => {
  // 각 테스트 후 상태 초기화
  document.getElementById("root").innerHTML = "";
  localStorage.clear();
  server.resetHandlers();

  stateManager.productList.reset();
});

describe("7. 카테고리 선택", () => {
  test("현재 선택된 카테고리 경로가 브레드크럼으로 표시된다", async () => {
    expect(screen.getByText("카테고리 로딩 중...")).toBeInTheDocument();

    await screen.findByText(/생활\/건강/);

    const target = screen.getByText(/생활\/건강/);

    await userEvent.click(target);

    expect(
      await screen.findByText(/pvc 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장/i),
    ).toBeInTheDocument();

    expect(await screen.findByText("총 300개의 상품")).toBeInTheDocument();

    expect(screen.getByText("카테고리:").parentNode.textContent.trim()).toMatch(/생활\/건강/);

    const category2 = await screen.findByText("자동차용품");
    await userEvent.click(category2);

    expect(await screen.findByText("총 11개의 상품")).toBeInTheDocument();
    expect(screen.getByText("카테고리:").parentNode.textContent.trim()).toMatch(/생활\/건강/);
    expect(screen.getByText("카테고리:").parentNode.textContent.trim()).toMatch(/자동차용품/);
  });

  test("브레드크럼 클릭으로 상위 카테고리로 이동할 수 있다", async () => {
    // 1depth 카테고리 브레드크럼 클릭
    expect(screen.getByText("카테고리 로딩 중...")).toBeInTheDocument();

    await screen.findByText("생활/건강");

    const category1 = screen.getByText("생활/건강");
    await userEvent.click(category1);
    const category2 = await screen.findByText("자동차용품");
    await userEvent.click(category2);

    expect(await screen.findByText("총 11개의 상품")).toBeInTheDocument();

    await userEvent.click(await screen.findByText("전체"));

    expect(await screen.findByText("총 340개의 상품")).toBeInTheDocument();
  });
});
