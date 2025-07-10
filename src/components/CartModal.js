export const CartModal = (() => {
  let isOpen = false;
  let modalElement = null;

  // 모달 템플릿
  const generateCartHTML = () => /* HTML */ `
    <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity modal-overlay"></div>
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden"
        >
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
              </svg>
              장바구니
            </h2>
            <button class="text-gray-400 hover:text-gray-600 p-1 close-btn">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <!-- 컨텐츠 -->
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            <!-- 빈 장바구니 -->
            <div class="flex-1 flex items-center justify-center p-8">
              <div class="text-center">
                <div class="text-gray-400 mb-4">
                  <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
                <p class="text-gray-600">원하는 상품을 담아보세요!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  /* 모달 생성 */
  function createModal() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = generateCartHTML();
    return wrapper.firstElementChild;
  }

  /* 이벤트 처리 */
  function attachEvents() {
    // X 버튼 클릭으로 닫기
    const closeBtn = modalElement.querySelector(".close-btn");
    closeBtn.addEventListener("click", close);

    // 배경 클릭으로 닫기
    const overlay = modalElement.querySelector(".modal-overlay");
    overlay.addEventListener("click", close);

    // ESC 키로 닫기
    function handleEsc(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", handleEsc);
      }
    }
    document.addEventListener("keydown", handleEsc);
  }

  /* 모달 닫기 */
  function close() {
    if (!isOpen || !modalElement) return;

    document.body.removeChild(modalElement);
    modalElement = null;
    isOpen = false;
  }

  /* 컨텐츠 업데이트 */
  function updateContent() {
    if (!isOpen || !modalElement) return;

    const contentDiv = modalElement.querySelector("#cart-content");
    contentDiv.innerHTML = generateCartHTML();
  }

  /* Public API */
  return {
    /* 모달 열기 */
    open() {
      if (isOpen) return;

      modalElement = createModal();
      document.body.appendChild(modalElement);
      attachEvents();
      updateContent(); // 최신 장바구니 내용으로 업데이트
      isOpen = true;
    },

    /* 모달 닫기 */
    close,

    /* 컨텐츠 업데이트 */
    update() {
      updateContent();
    },
  };
})();
