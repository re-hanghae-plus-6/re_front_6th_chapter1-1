// // cartHandlers.js
// import { CartModal } from "../components/CartModal.js";

// // 장바구니 열기 핸들러
// export function viewCartHandler(state) {
//   const cartIcon = document.getElementById("cart-icon-btn");
//   if (!cartIcon) return;
//   cartIcon.addEventListener("click", () => {
//     const modalPortal = document.getElementById("modal-portal");
//     if (!modalPortal) return;
//     modalPortal.innerHTML = CartModal({ cart: state.cart });
//     setupQuantityButtons(state.cart, state);
//     closeCartModal();
//   });
// }

// // 장바구니 모달 닫기 핸들러
// export function closeCartModal() {
//   const modalPortal = document.getElementById("modal-portal");
//   const cartModalCloseBtn = document.getElementById("cart-modal-close-btn");
//   const cartModalBackground = document.querySelector(".cart-modal-overlay");

//   if (cartModalCloseBtn) {
//     cartModalCloseBtn.addEventListener("click", () => {
//       if (modalPortal) modalPortal.innerHTML = "";
//     });
//   }

//   if (cartModalBackground) {
//     cartModalBackground.addEventListener("click", (e) => {
//       if (e.target === cartModalBackground && modalPortal) {
//         modalPortal.innerHTML = "";
//       }
//     });
//   }

//   const escListener = (e) => {
//     if (e.key === "Escape" && modalPortal) {
//       modalPortal.innerHTML = "";
//       document.removeEventListener("keydown", escListener); // 이벤트 제거
//     }
//   };

//   document.addEventListener("keydown", escListener);
// }

// // 수량 증가/감소 버튼 셋업
// export function setupQuantityButtons(cart, state) {
//   const itemMap = new Map();

//   cart.forEach((item) => {
//     if (itemMap.has(item.productId)) {
//       itemMap.get(item.productId).quantity += 1;
//     } else {
//       itemMap.set(item.productId, { ...item, quantity: 1 });
//     }
//   });

//   document.querySelectorAll(".quantity-increase-btn").forEach((button) => {
//     button.addEventListener("click", () => {
//       const productId = button.dataset.productId;
//       const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
//       const priceEl = document.querySelector(`.item-price[data-product-id="${productId}"]`);
//       const item = itemMap.get(productId);

//       item.quantity += 1;
//       input.value = item.quantity;
//       priceEl.textContent = `${item.lprice * item.quantity}원`;
//       updateTotal(itemMap);

//       // 상태에 반영 (필요 시)
//       updateCartStateQuantity(state, productId, item.quantity);
//     });
//   });

//   document.querySelectorAll(".quantity-decrease-btn").forEach((button) => {
//     button.addEventListener("click", () => {
//       const productId = button.dataset.productId;
//       const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
//       const priceEl = document.querySelector(`.item-price[data-product-id="${productId}"]`);
//       const item = itemMap.get(productId);

//       if (item.quantity > 1) {
//         item.quantity -= 1;
//         input.value = item.quantity;
//         priceEl.textContent = `${item.lprice * item.quantity}원`;
//         updateTotal(itemMap);

//         // 상태에 반영 (필요 시)
//         updateCartStateQuantity(state, productId, item.quantity);
//       }
//     });
//   });

//   updateTotal(itemMap);
// }

// // 총 합계 업데이트
// export function updateTotal(itemMap) {
//   const totalPrice = Array.from(itemMap.values()).reduce((sum, item) => sum + item.lprice * item.quantity, 0);
//   const totalQuantity = Array.from(itemMap.values()).reduce((sum, item) => sum + item.quantity, 0);

//   const totalPriceEl = document.querySelector(".text-xl.font-bold.text-blue-600");
//   const totalQuantitySpan = document.querySelector("h2 span");
//   const selectAllLabel = document.querySelector("#cart-modal-select-all-checkbox")?.nextSibling;

//   if (totalPriceEl) totalPriceEl.textContent = `${totalPrice}원`;
//   if (totalQuantitySpan) totalQuantitySpan.textContent = `(${totalQuantity})`;
//   if (selectAllLabel) selectAllLabel.textContent = `전체선택 (${totalQuantity}개)`;
// }

// // 장바구니 수량 상태 반영 함수
// function updateCartStateQuantity(state, productId, quantity) {
//   // state.cart에서 productId에 해당하는 아이템 수량 업데이트
//   state.cart = state.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item));
//   // 수량 변경에 따른 카운트 업데이트
//   updateCartCount(state.cart);
// }

// // 장바구니 아이콘 숫자 업데이트
// export function updateCartCount(cart) {
//   const countEl = document.getElementById("cart-count");
//   if (!countEl) return;

//   const total = cart.reduce((sum, item) => sum + item.quantity, 0);
//   countEl.textContent = total;

//   if (total === 0) {
//     countEl.classList.add("hidden");
//   } else {
//     countEl.classList.remove("hidden");
//   }
// }

// // 장바구니 담기 버튼 핸들러
// export function addToCartHandler(state) {
//   const buttons = document.querySelectorAll(".add-to-cart-btn");

//   buttons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const productId = btn.dataset.productId;
//       const product = state.products.find((p) => p.productId === productId);

//       if (product) {
//         // 중복 추가 방지 예시 (필요하면 수정 가능)
//         const exists = state.cart.some((item) => item.productId === productId);
//         if (!exists) {
//           state.cart = [...state.cart, { ...product, quantity: 1 }];
//         } else {
//           // 이미 있으면 수량만 1 증가
//           state.cart = state.cart.map((item) =>
//             item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
//           );
//         }

//         updateCartCount(state.cart);
//         showAddToCartToast();
//       }
//     });
//   });
// }

// /** 체크박스 선택 삭제 함수 */
// export function setupCartItemRemoveHandler(state, render) {
//   // 이벤트 위임 권장: 모달 내 컨테이너에 이벤트리스너 하나만 걸기
//   const modal = document.querySelector(".cart-modal-overlay");
//   if (!modal) return;

//   modal.addEventListener("click", (e) => {
//     if (e.target.matches(".cart-item-remove-btn")) {
//       const productId = e.target.dataset.productId;
//       if (!productId) return;

//       // 체크된 아이템 삭제 로직
//       state.cart = state.cart.filter((item) => item.productId !== productId);
//       render();
//     }
//   });
// }

// /** 전체선택 & 개별 체크박스 체크 이벤트 핸들러 */
// export function setupCartCheckboxHandlers(state, render) {
//   const modal = document.querySelector(".cart-modal-overlay");
//   if (!modal) return;

//   modal.addEventListener("change", (e) => {
//     // 전체 선택 체크박스
//     if (e.target.id === "cart-modal-select-all-checkbox") {
//       const checked = e.target.checked;
//       const checkboxes = modal.querySelectorAll(".cart-item-checkbox");
//       checkboxes.forEach((cb) => (cb.checked = checked));
//     }

//     // 개별 체크박스 변경 시 전체선택 체크박스 상태 업데이트
//     if (e.target.classList.contains("cart-item-checkbox")) {
//       const checkboxes = modal.querySelectorAll(".cart-item-checkbox");
//       const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
//       const selectAll = modal.querySelector("#cart-modal-select-all-checkbox");
//       if (selectAll) selectAll.checked = allChecked;
//     }
//   });
// }

// /** 선택된 항목 삭제 */
// export function setupRemoveSelectedHandler(state, render) {
//   const modal = document.querySelector(".cart-modal-overlay");
//   if (!modal) return;

//   modal.addEventListener("click", (e) => {
//     if (e.target.id === "cart-modal-remove-selected-btn") {
//       const checkedBoxes = modal.querySelectorAll(".cart-item-checkbox:checked");
//       const productIdsToRemove = Array.from(checkedBoxes).map((cb) => cb.dataset.productId);

//       if (productIdsToRemove.length === 0) return;

//       state.cart = state.cart.filter((item) => !productIdsToRemove.includes(item.productId));
//       render();
//     }
//   });
// }

// /** 전체 비우기 함수  */
// export function setupClearCartHandler(state, render) {
//   const clearBtn = document.getElementById("cart-modal-clear-cart-btn");
//   if (!clearBtn) return;

//   clearBtn.addEventListener("click", () => {
//     state.cart = [];
//     render();
//   });
// }
// // 장바구니 추가 알림 토스트
// export function showAddToCartToast() {
//   const old = document.getElementById("toast-message");
//   if (old) old.remove();

//   const toast = document.createElement("div");
//   toast.id = "toast-message";
//   toast.className = "fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50";

//   toast.innerHTML = `
//     <div class="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
//       <div class="flex-shrink-0">
//         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
//         </svg>
//       </div>
//       <p class="text-sm font-medium">장바구니에 추가되었습니다</p>
//       <button id="toast-close-btn" class="flex-shrink-0 ml-2 text-white hover:text-gray-200">
//         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//         </svg>
//       </button>
//     </div>
//   `;

//   document.body.appendChild(toast);

//   toast.querySelector("#toast-close-btn").addEventListener("click", () => {
//     toast.remove();
//   });

//   setTimeout(() => {
//     toast.remove();
//   }, 3000);
// }
