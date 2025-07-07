// 장바구니 모달 컴포넌트
// openCartModal() 을 호출하면 .cart-modal-overlay 를 생성해 모달을 표시합니다.

export function openCartModal() {
  // 이미 열려 있으면 중복 생성X
  if (document.querySelector(".cart-modal-overlay")) return;

  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "cart-modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50";

  // Modal box
  const modal = document.createElement("div");
  modal.className = "bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center";

  modal.innerHTML = `
    <h2 class="text-lg font-bold mb-4">장바구니가 비어있습니다</h2>
    <button id="cart-modal-close-btn" aria-label="close" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>`;

  // 위치 relative for close button
  modal.style.position = "relative";

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closeBtn = modal.querySelector("#cart-modal-close-btn") as HTMLButtonElement | null;
  const cleanup = () => {
    overlay.remove();
    window.removeEventListener("keydown", handleEsc);
  };

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") cleanup();
  };

  closeBtn?.addEventListener("click", cleanup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cleanup();
  });
  window.addEventListener("keydown", handleEsc);
}
