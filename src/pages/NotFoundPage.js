export function renderNotFoundPage() {
  document.getElementById("root").innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-2xl font-bold mb-4">404 Not Found</h1>
      <p class="text-gray-600">존재하지 않는 페이지입니다.</p>
    </div>
  `;
}
