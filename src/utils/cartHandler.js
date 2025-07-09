// 로컬 스토리지에서 장바구니 데이터 가져오기
export const getCartItems = () => {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : [];
};

// 장바구니에 상품 추가
export const addToCart = (product) => {
  const cartItems = getCartItems();

  // 이미 장바구니에 있는 상품인지 확인
  const existingItemIndex = cartItems.findIndex((item) => item.productId === product.productId);

  if (existingItemIndex !== -1) {
    // 이미 있으면 수량 증가
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // 없으면 새로 추가
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }

  // 로컬 스토리지에 저장
  localStorage.setItem("cart", JSON.stringify(cartItems));

  // 장바구니 개수 업데이트
  updateCartCount();

  return cartItems;
};

// 장바구니에서 상품 제거
export const removeFromCart = (productId) => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter((item) => item.productId !== productId);

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  updateCartCount();

  return updatedCart;
};

// 장바구니 개수 업데이트
export const updateCartCount = () => {
  const cartItems = getCartItems();
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartCountElement = document.querySelector("#cart-icon-btn span");
  if (cartCountElement) {
    cartCountElement.textContent = totalQuantity;

    // 개수가 0이면 배지 숨기기
    if (totalQuantity === 0) {
      cartCountElement.style.display = "none";
    } else {
      cartCountElement.style.display = "flex";
    }
  }
};

// 장바구니 모달 생성
export const createCartModal = () => {
  const cartItems = getCartItems();
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + parseInt(item.lprice) * item.quantity, 0);

  // 모달이 이미 존재하면 제거
  const existingModal = document.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 모달 HTML 생성
  const modalHTML = `
    <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
      <!-- 배경 오버레이 -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"></div>
      <!-- 모달 컨테이너 -->
      <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
        <div class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden">
          <!-- 헤더 -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
              </svg>
              장바구니
              ${totalQuantity > 0 ? `<span class="text-sm font-normal text-gray-600 ml-1">(${totalQuantity})</span>` : ""}
            </h2>
            <button id="cart-modal-close-btn" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <!-- 컨텐츠 -->
          <div class="flex flex-col max-h-[calc(90vh-120px)]">
            ${
              cartItems.length === 0
                ? `
              <!-- 빈 장바구니 -->
              <div class="flex-1 flex items-center justify-center p-8">
                <div class="text-center">
                  <div class="text-gray-400 mb-4">
                    <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
                  <p class="text-gray-600">원하는 상품을 담아보세요!</p>
                </div>
              </div>
            `
                : `
              <!-- 전체 선택 섹션 -->
              <div class="p-4 border-b border-gray-200 bg-gray-50">
                <label class="flex items-center text-sm text-gray-700">
                  <input type="checkbox" id="cart-modal-select-all-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2">
                  전체선택 (${totalQuantity}개)
                </label>
              </div>
              <!-- 아이템 목록 -->
              <div class="flex-1 overflow-y-auto">
                <div class="p-4 space-y-4">
                  ${cartItems
                    .map(
                      (item) => `
                    <div class="flex items-center py-3 border-b border-gray-100 cart-item" data-product-id="${item.productId}">
                      <!-- 선택 체크박스 -->
                      <label class="flex items-center mr-3">
                        <input type="checkbox" class="cart-item-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded 
                      focus:ring-blue-500" data-product-id="${item.productId}">
                      </label>
                      <!-- 상품 이미지 -->
                      <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover cursor-pointer cart-item-image" data-product-id="${item.productId}">
                      </div>
                      <!-- 상품 정보 -->
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-900 truncate cursor-pointer cart-item-title" data-product-id="${item.productId}">
                          ${item.title}
                        </h4>
                        <p class="text-sm text-gray-600 mt-1">
                          ${item.lprice}원
                        </p>
                        <!-- 수량 조절 -->
                        <div class="flex items-center mt-2">
                          <button class="quantity-decrease-btn w-7 h-7 flex items-center justify-center 
                       border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.productId}">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <input type="number" value="${item.quantity}" min="1" class="quantity-input w-12 h-7 text-center text-sm border-t border-b 
                      border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" disabled="" data-product-id="${item.productId}">
                          <button class="quantity-increase-btn w-7 h-7 flex items-center justify-center 
                       border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100" data-product-id="${item.productId}">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <!-- 가격 및 삭제 -->
                      <div class="text-right ml-3">
                        <p class="text-sm font-medium text-gray-900">
                          ${parseInt(item.lprice) * item.quantity}원
                        </p>
                        <button class="cart-item-remove-btn mt-1 text-xs text-red-600 hover:text-red-800" data-product-id="${item.productId}">
                          삭제
                        </button>
                      </div>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
            }
          </div>
          ${
            cartItems.length > 0
              ? `
            <!-- 하단 액션 -->
            <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <!-- 총 금액 -->
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-bold text-gray-900">총 금액</span>
                <span class="text-xl font-bold text-blue-600">${totalPrice}원</span>
              </div>
              <!-- 액션 버튼들 -->
              <div class="space-y-2">
                <div class="flex gap-2">
                  <button id="cart-modal-clear-cart-btn" class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md 
                           hover:bg-gray-700 transition-colors text-sm">
                    전체 비우기
                  </button>
                  <button id="cart-modal-checkout-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md 
                           hover:bg-blue-700 transition-colors text-sm">
                    구매하기
                  </button>
                </div>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  // 모달을 body에 추가
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 모달 이벤트 리스너 설정
  setupCartModalEventListeners();
};

// 장바구니 모달 이벤트 리스너 설정
export const setupCartModalEventListeners = () => {
  // 모달 닫기 버튼
  const closeBtn = document.getElementById("cart-modal-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeCartModal);
  }

  // 배경 클릭으로 모달 닫기
  const overlay = document.querySelector(".cart-modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", closeCartModal);
  }

  // ESC 키로 모달 닫기
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeCartModal();
      // ESC 키 이벤트 리스너 제거
      document.removeEventListener("keydown", handleKeyDown);
    }
  };

  // ESC 키 이벤트 리스너 추가
  document.addEventListener("keydown", handleKeyDown);

  // 전체 선택 체크박스
  const selectAllCheckbox = document.getElementById("cart-modal-select-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", (e) => {
      const checkboxes = document.querySelectorAll(".cart-item-checkbox");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });
    });
  }

  // 개별 아이템 체크박스
  const itemCheckboxes = document.querySelectorAll(".cart-item-checkbox");
  itemCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectAllCheckbox);
  });

  // 수량 증가 버튼
  const increaseBtns = document.querySelectorAll(".quantity-increase-btn");
  increaseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.closest("button").getAttribute("data-product-id");
      const cartItems = getCartItems();
      const itemIndex = cartItems.findIndex((item) => item.productId === productId);

      if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartCount();
        createCartModal(); // 모달 새로고침
      }
    });
  });

  // 수량 감소 버튼
  const decreaseBtns = document.querySelectorAll(".quantity-decrease-btn");
  decreaseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.closest("button").getAttribute("data-product-id");
      const cartItems = getCartItems();
      const itemIndex = cartItems.findIndex((item) => item.productId === productId);

      if (itemIndex !== -1 && cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartCount();
        createCartModal(); // 모달 새로고침
      }
    });
  });

  // 삭제 버튼
  const removeBtns = document.querySelectorAll(".cart-item-remove-btn");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-product-id");
      removeFromCart(productId);
      createCartModal(); // 모달 새로고침
    });
  });

  // 전체 비우기 버튼
  const clearCartBtn = document.getElementById("cart-modal-clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      updateCartCount();
      createCartModal(); // 모달 새로고침
    });
  }

  // 구매하기 버튼
  const checkoutBtn = document.getElementById("cart-modal-checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("구매 기능은 준비 중입니다.");
    });
  }
};

// 전체 선택 체크박스 업데이트
const updateSelectAllCheckbox = () => {
  const selectAllCheckbox = document.getElementById("cart-modal-select-all-checkbox");
  const itemCheckboxes = document.querySelectorAll(".cart-item-checkbox");

  if (selectAllCheckbox && itemCheckboxes.length > 0) {
    const checkedCount = Array.from(itemCheckboxes).filter((cb) => cb.checked).length;
    selectAllCheckbox.checked = checkedCount === itemCheckboxes.length;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < itemCheckboxes.length;
  }
};

// 장바구니 모달 닫기
export const closeCartModal = () => {
  const modal = document.querySelector(".cart-modal");
  if (modal) {
    modal.remove();
  }
};

// 이벤트 리스너가 이미 등록되었는지 확인하는 플래그
let cartEventListenersInitialized = false;

// 장바구니 이벤트 리스너 설정
export const setupCartEventListeners = () => {
  // 이미 이벤트 리스너가 등록되어 있다면 중복 등록 방지
  if (cartEventListenersInitialized) {
    return;
  }

  cartEventListenersInitialized = true;

  // 장바구니 담기 버튼 클릭 이벤트
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productId = e.target.getAttribute("data-product-id");

      // 상품 데이터 찾기 (products 배열에서)
      const productCard = e.target.closest(".product-card");
      if (productCard) {
        const product = {
          productId: productId,
          title: productCard.querySelector("h3").textContent,
          image: productCard.querySelector("img").src,
          lprice: productCard.querySelector(".text-lg").textContent.replace("원", ""),
        };

        addToCart(product);

        // 사용자에게 피드백 제공
        const originalText = e.target.textContent;
        e.target.textContent = "담기 완료!";
        e.target.classList.add("bg-green-600");
        e.target.classList.remove("bg-blue-600", "hover:bg-blue-700");

        setTimeout(() => {
          e.target.textContent = originalText;
          e.target.classList.remove("bg-green-600");
          e.target.classList.add("bg-blue-600", "hover:bg-blue-700");
        }, 1000);
      }
    }
  });

  const cartIconBtn = document.getElementById("cart-icon-btn");

  cartIconBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    createCartModal();
  });
};

// 이벤트 리스너 초기화 함수 (테스트용)
export const resetCartEventListeners = () => {
  cartEventListenersInitialized = false;
};
