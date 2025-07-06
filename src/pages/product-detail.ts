export function detailPage({ id }: { id: string }) {
  const root = document.getElementById("root");
  if (!root) return;

  root.innerHTML = `
    <div class="min-h-screen flex flex-col gap-4 items-center justify-center">
      <h1 class="text-2xl font-semibold">상품 상세 ${id}</h1>
      <a
        href="/"
        data-link
        class="inline-block rounded bg-primary px-4 py-2 text-white shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        목록으로 돌아가기
      </a>
      <a
        href="/?a=b"
        data-link
        class="inline-block rounded bg-secondary px-4 py-2 text-white shadow hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50"
      >
        쿼리 파라미터 테스트
      </a>
    </div>
  `;
}
