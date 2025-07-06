export function homePage() {
  const root = document.getElementById("root");
  if (!root) return;

  root.innerHTML = `
    <div class="min-h-screen flex flex-col gap-4 items-center justify-center">
      <span>카테고리 로딩 중...</span>
      <a
        href="/product/1"
        data-link
        class="inline-block rounded bg-primary px-4 py-2 text-white shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        상품 1 상세 보기
      </a>
    </div>
  `;
}
