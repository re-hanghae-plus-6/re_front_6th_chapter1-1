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
    await this.page.waitForSelector("text=장바구니에 추가되었습니다", { timeout: 5000 });
  }

  // 장바구니 모달 열기
  async openCartModal() {
    await this.page.click("#cart-icon-btn");
    await this.page.waitForSelector(".cart-modal-overlay", { timeout: 5000 });
  }
}

test.describe("E2E: 쇼핑몰 전체 사용자 시나리오", () => {
  test.beforeEach(async ({ page }) => {
    // 로컬 스토리지 초기화
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe("1. 검색 및 필터링 기능이 URL과 연동된다.", () => {
    test("검색어 입력 후 Enter 키로 검색하고 URL이 업데이트된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 검색어 입력
      await page.fill("#search-input", "젤리");
      await page.press("#search-input", "Enter");

      // URL 업데이트 확인
      await expect(page).toHaveURL(/search=%EC%A0%A4%EB%A6%AC/);

      // 검색 결과 확인
      await expect(page.locator("text=3개")).toBeVisible();

      // 검색어가 검색창에 유지되는지 확인
      await expect(page.locator("#search-input")).toHaveValue("젤리");

      // 검색어 입력
      await page.fill("#search-input", "아이패드");
      await page.press("#search-input", "Enter");

      // URL 업데이트 확인
      await expect(page).toHaveURL(/search=%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C/);

      // 검색 결과 확인
      await expect(page.locator("text=21개")).toBeVisible();

      // 새로고침을 해도 유지 되는지 확인
      await page.reload();
      await helpers.waitForPageLoad();
      await expect(page.locator("text=21개")).toBeVisible();
    });

    test("정렬 옵션 변경 시 URL이 업데이트된다", async ({ page }) => {
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

    test("페이지당 상품 수 변경 시 URL이 업데이트된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await helpers.waitForPageLoad();

      // 10개로 변경
      await page.selectOption("#limit-select", "10");
      await expect(page).toHaveURL(/limit=10/);
      await page.waitForFunction(() => {
        return document.querySelectorAll(".product-card").length === 10;
      });
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "탈부착 방충망 자석쫄대 방풍비닐 창문방충망 셀프시공 DIY 백색 100cm" [level=3]`,
      );

      await page.selectOption("#limit-select", "20");
      await expect(page).toHaveURL(/limit=20/);
      await page.waitForFunction(() => {
        return document.querySelectorAll(".product-card").length === 20;
      });
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "고양이 난간 안전망 복층 베란다 방묘창 방묘문 방충망 캣도어 일반형검정1mx1m" [level=3]`,
      );

      await page.selectOption("#limit-select", "50");
      await expect(page).toHaveURL(/limit=50/);
      await page.waitForFunction(() => {
        return document.querySelectorAll(".product-card").length === 50;
      });
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "강아지 고양이 아이스팩 파우치 여름 베개 젤리곰 M사이즈" [level=3]`,
      );

      await page.selectOption("#limit-select", "100");
      await expect(page).toHaveURL(/limit=100/);
      await page.waitForFunction(() => {
        return document.querySelectorAll(".product-card").length === 100;
      });
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "고양이 스크래쳐 숨숨집 하우스 대형 원목 스크레쳐 A type" [level=3]`,
      );

      await page.reload();
      await helpers.waitForPageLoad();
      await expect(page.locator(".product-card").last()).toMatchAriaSnapshot(
        `- heading "고양이 스크래쳐 숨숨집 하우스 대형 원목 스크레쳐 A type" [level=3]`,
      );
    });

    test("검색어와 필터 조건이 URL에서 복원된다", async ({ page }) => {
      const helpers = new E2EHelpers(page);

      await page.goto("/?search=젤리&sort=price_desc&limit=10");
      await helpers.waitForPageLoad();

      await expect(page.locator("#search-input")).toHaveValue("젤리");
      await expect(page.locator("#sort-select")).toHaveValue("price_desc");
      await expect(page.locator("#limit-select")).toHaveValue("10");
      await expect(page.getByRole("main")).toMatchAriaSnapshot(`- text: /총 3개의 상품/`);

      await page.goto("/?search=고양이&sort=name_desc&limit=50");
      await helpers.waitForPageLoad();

      await expect(page.locator("#search-input")).toHaveValue("고양이");
      await expect(page.locator("#sort-select")).toHaveValue("name_desc");
      await expect(page.locator("#limit-select")).toHaveValue("50");
      await expect(page.getByRole("main")).toMatchAriaSnapshot(`- text: /총 84개의 상품/`);
    });
  });

  test.describe("2. 상품 상세 페이지와 URL이 연동된다.", () => {
    test("상품 클릭부터 관련 상품 이동까지 전체 플로우", async ({ page }) => {
      await page.evaluate(() => {
        window.loadFlag = true;
        window.history.pushState({}, "", "/product/85067212996");
        window.dispatchEvent(new Event("popstate"));
      });

      // 상세 페이지 로딩 확인
      await expect(page.locator("text=상품 상세")).toBeVisible();

      // h1 태그에 상품명 확인
      await expect(
        page.locator('h1:text("PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장")'),
      ).toBeVisible();

      // 관련 상품 섹션 확인
      await expect(page.locator("text=관련 상품")).toBeVisible();
      const relatedProducts = page.locator(".related-product-card");
      await expect(relatedProducts.first()).toBeVisible();

      // 첫 번째 관련 상품 클릭
      await relatedProducts.first().click();

      // 다른 상품의 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL("/product/86940857379");
      await expect(
        page.locator('h1:text("샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이")'),
      ).toBeVisible();

      await expect(await page.evaluate(() => window.loadFlag)).toBe(true);

      await page.reload();

      await expect(
        page.locator('h1:text("샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이")'),
      ).toBeVisible();

      await expect(await page.evaluate(() => window.loadFlag)).toBe(undefined);
    });
  });

  test.describe("3. SPA 네비게이션", () => {
    test("브라우저 뒤로가기/앞으로가기가 올바르게 작동한다", async ({ page }) => {
      const helpers = new E2EHelpers(page);
      await page.evaluate(() => {
        window.loadFlag = true;
      });
      await helpers.waitForPageLoad();

      // 상품 상세 페이지로 이동
      const productCard = page
        .locator("text=PVC 투명 젤리 쇼핑백")
        .locator('xpath=ancestor::*[contains(@class, "product-card")]');
      await productCard.locator("img").click();

      await expect(page).toHaveURL("/product/85067212996");
      await expect(
        page.locator('h1:text("PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장")'),
      ).toBeVisible();
      await expect(page.locator("text=관련 상품")).toBeVisible();
      const relatedProducts = page.locator(".related-product-card");
      await relatedProducts.first().click();

      await expect(page).toHaveURL("/product/86940857379");
      await expect(
        page.locator('h1:text("샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이")'),
      ).toBeVisible();

      // 브라우저 뒤로가기
      await page.goBack();
      await expect(page).toHaveURL("/product/85067212996");
      await expect(
        page.locator('h1:text("PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장")'),
      ).toBeVisible();

      // 브라우저 앞으로가기
      await page.goForward();
      await expect(page).toHaveURL("/product/86940857379");
      await expect(
        page.locator('h1:text("샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이")'),
      ).toBeVisible();

      await page.goBack();
      await page.goBack();
      await expect(page).toHaveURL("/");
      const firstProductCard = page.locator(".product-card").first();
      await expect(firstProductCard.locator("img")).toBeVisible();

      expect(await page.evaluate(() => window.loadFlag)).toBe(true);

      await page.reload();
      expect(
        await page.evaluate(() => {
          return window.loadFlag;
        }),
      ).toBe(undefined);
    });

    // 404 페이지 테스트
    test("존재하지 않는 페이지 접근 시 404 페이지가 표시된다", async ({ page }) => {
      // 존재하지 않는 경로로 이동
      await page.goto("/non-existent-page");

      // 404 페이지 확인
      await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - img: /404 페이지를 찾을 수 없습니다/
    - link "홈으로"
    `);
    });
  });
});
