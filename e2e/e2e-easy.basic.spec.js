import { expect, test } from "@playwright/test";

// 테스트 설정
test.describe.configure({ mode: "serial" });

// 헬퍼 함수들
class E2EHelpers {
  constructor(page) {
    this.page = page;
  }

  // 페이지 로딩 대기
  async waitForPageLoad() {
    await this.page.waitForSelector('[data-testid="products-grid"], #products-grid', { timeout: 10000 });
    await this.page.waitForFunction(() => {
      const text = document.body.textContent;
      return text.includes("총") && text.includes("개");
    });
  }

  // 상품을 장바구니에 추가
  async addProductToCart(productName) {
    await this.page.click(
      `text=${productName} >> xpath=ancestor::*[contains(@class, 'product-card')] >> .add-to-cart-btn`,
    );
  }
}

test.describe("E2E: 쇼핑몰 전체 사용자 시나리오 > 난이도 쉬움 > 기본과제", () => {
  test.beforeEach(async ({ page }) => {
    // 로컬 스토리지 초기화
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe("1. 애플리케이션 초기화 및 기본 기능", () => {
    test("페이지 접속 시 로딩 상태가 표시되고 상품 목록이 정상적으로 로드된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);

      // 로딩 상태 확인
      await expect(page.locator("text=카테고리 로딩 중...")).toBeVisible();

      // 상품 목록 로드 완료 대기
      await helpers.waitForPageLoad();

      // 상품 개수 확인 (340개)
      await expect(page.locator("text=340개")).toBeVisible();

      // 기본 UI 요소들 존재 확인
      await expect(page.locator("#search-input")).toBeVisible();
      await expect(page.locator("#cart-icon-btn")).toBeVisible();
      await expect(page.locator("#limit-select")).toBeVisible();
      await expect(page.locator("#sort-select")).toBeVisible();
    });

    test("상품 카드에 기본 정보가 올바르게 표시된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 첫 번째 상품 카드 확인
      const firstProductCard = page.locator(".product-card").first();

      // 상품 이미지 존재 확인
      await expect(firstProductCard.locator("img")).toBeVisible();

      // 상품명 확인
      await expect(firstProductCard).toContainText(/pvc 투명 젤리 쇼핑백|고양이 난간 안전망/i);

      // 가격 정보 확인 (숫자 + 원)
      await expect(firstProductCard).toContainText(/\d{1,3}(,\d{3})*원/);

      // 장바구니 버튼 확인
      await expect(firstProductCard.locator(".add-to-cart-btn")).toBeVisible();
    });
  });

  test.describe("2. 검색 및 필터링 기능", () => {
    test("검색어 입력 후 Enter 키로 검색할 수 있다.", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 검색어 입력
      await page.fill("#search-input", "젤리");
      await page.press("#search-input", "Enter");

      // 검색 결과 확인
      await expect(page.locator("text=3개")).toBeVisible();

      // 검색어가 검색창에 유지되는지 확인
      await expect(page.locator("#search-input")).toHaveValue("젤리");

      // 검색어 입력
      await page.fill("#search-input", "아이패드");
      await page.press("#search-input", "Enter");

      // 검색 결과 확인
      await expect(page.locator("text=21개")).toBeVisible();
    });

    test("상품의 정렬을 변경할 수 있다.", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 가격 높은순으로 정렬
      await page.selectOption("#sort-select", "price_desc");

      // 첫 번째 상품 이 가격 높은 순으로 정렬되었는지 확인
      await expect(page.locator(".product-card").first()).toMatchAriaSnapshot(`
    - img "ASUS ROG Flow Z13 GZ302EA-RU110W 64GB, 1TB"
    - heading "ASUS ROG Flow Z13 GZ302EA-RU110W 64GB, 1TB" [level=3]
    - paragraph: ASUS
    - paragraph: 3,749,000원
    - button "장바구니 담기"
      `);

      await page.selectOption("#sort-select", "name_asc");
      await expect(page.locator(".product-card").nth(1)).toMatchAriaSnapshot(`
    - img "[매일출발]유로블루플러스 차량용 요소수 국내산 Adblue 호스포함"
    - heading "[매일출발]유로블루플러스 차량용 요소수 국내산 Adblue 호스포함" [level=3]
    - paragraph: 유로블루플러스
    - paragraph: 8,700원
    - button "장바구니 담기"
    `);

      await page.selectOption("#sort-select", "name_desc");
      await expect(page.locator(".product-card").nth(1)).toMatchAriaSnapshot(`
    - img "P&G 다우니 울트라 섬유유연제 에이프릴 프레쉬, 5.03L, 1개"
    - heading "P&G 다우니 울트라 섬유유연제 에이프릴 프레쉬, 5.03L, 1개" [level=3]
    - paragraph: 다우니
    - paragraph: 16,610원
    - button "장바구니 담기"
      `);

      await page.reload();
      await helpers.waitForPageLoad();
      await expect(page.locator(".product-card").nth(1)).toMatchAriaSnapshot(`
    - img "P&G 다우니 울트라 섬유유연제 에이프릴 프레쉬, 5.03L, 1개"
    - heading "P&G 다우니 울트라 섬유유연제 에이프릴 프레쉬, 5.03L, 1개" [level=3]
    - paragraph: 다우니
    - paragraph: 16,610원
    - button "장바구니 담기"
      `);
    });

    test("페이지당 상품 수 변경이 가능하다.", async ({ page }) => {
      const helpers = new E2EHelpers(page);

      await page.goto("/");
      await helpers.waitForPageLoad();

      // 10개로 변경
      await page.selectOption("#limit-select", "10");

      await page.waitForFunction(() => document.querySelectorAll(".product-card").length === 10);
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "탈부착 방충망 자석쫄대 방풍비닐 창문방충망 셀프시공 DIY 백색 100cm" [level=3]`,
      );

      await page.selectOption("#limit-select", "20");

      await page.waitForFunction(() => document.querySelectorAll(".product-card").length === 20);
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "고양이 난간 안전망 복층 베란다 방묘창 방묘문 방충망 캣도어 일반형검정1mx1m" [level=3]`,
      );

      await page.selectOption("#limit-select", "50");

      await page.waitForFunction(() => document.querySelectorAll(".product-card").length === 50);
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "강아지 고양이 아이스팩 파우치 여름 베개 젤리곰 M사이즈" [level=3]`,
      );

      await page.selectOption("#limit-select", "100");

      await page.waitForFunction(() => document.querySelectorAll(".product-card").length === 100);
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "고양이 스크래쳐 숨숨집 하우스 대형 원목 스크레쳐 A type" [level=3]`,
      );
    });
  });

  test.describe("3. 장바구니 상태 유지", () => {
    test("장바구니 아이콘에 상품 개수가 정확히 표시된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 초기에는 개수 표시가 없어야 함
      await expect(page.locator("#cart-icon-btn span")).not.toBeVisible();

      // 첫 번째 상품 추가
      await helpers.addProductToCart("PVC 투명 젤리 쇼핑백");
      await expect(page.locator("#cart-icon-btn span")).toHaveText("1");

      // 두 번째 상품 추가
      await helpers.addProductToCart("샷시 풍지판");
      await expect(page.locator("#cart-icon-btn span")).toHaveText("2");

      // 첫 번째 상품 한 번 더 추가
      await helpers.addProductToCart("PVC 투명 젤리 쇼핑백");
      await expect(page.locator("#cart-icon-btn span")).toHaveText("2");
    });
  });

  test.describe("4. 상품 상세 페이지 워크플로우", () => {
    test("상품 클릭부터 관련 상품 이동까지 전체 플로우", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await page.evaluate(() => {
        window.loadFlag = true;
      });
      await helpers.waitForPageLoad();

      // 상품 이미지 클릭하여 상세 페이지로 이동
      const productCard = page
        .locator("text=PVC 투명 젤리 쇼핑백")
        .locator('xpath=ancestor::*[contains(@class, "product-card")]');
      await productCard.locator("img").click();

      // 상세 페이지 로딩 확인
      await expect(page.locator("text=상품 상세")).toBeVisible();

      // h1 태그에 상품명 확인
      await expect(
        page.locator('h1:text("PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장")'),
      ).toBeVisible();

      // 수량 조절 후 장바구니 담기
      await page.click("#quantity-increase");
      await expect(page.locator("#quantity-input")).toHaveValue("2");

      await page.click("#add-to-cart-btn");

      // 관련 상품 섹션 확인
      await expect(page.locator("text=관련 상품")).toBeVisible();

      const relatedProducts = page.locator(".related-product-card");
      await expect(relatedProducts.first()).toBeVisible();

      // 첫 번째 관련 상품 클릭
      await relatedProducts.first().click();

      // 다른 상품의 상세 페이지로 이동했는지 확인
      await expect(
        page.locator('h1:text("샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이")'),
      ).toBeVisible();

      await expect(await page.evaluate(() => window.loadFlag)).toBe(true);
    });
  });

  test.describe("5. 무한 스크롤 기능", () => {
    test("페이지 하단 스크롤 시 추가 상품이 로드된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 초기 상품 카드 수 확인
      const initialCards = await page.locator(".product-card").count();
      expect(initialCards).toBe(20);

      // 페이지 하단으로 스크롤
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // 로딩 인디케이터 확인
      await expect(page.locator("text=상품을 불러오는 중...")).toBeVisible();

      // 추가 상품 로드 대기
      await page.waitForFunction(() => document.querySelectorAll(".product-card").length === 40);

      // 상품 수가 증가했는지 확인
      const updatedCards = await page.locator(".product-card").count();
      expect(updatedCards).toBe(40);
    });
  });
});
