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

  // 장바구니 아이콘 클릭 이벤트 (필요시 장바구니 페이지로 이동)
  document.addEventListener("click", (e) => {
    if (e.target.closest("#cart-icon-btn")) {
      // 장바구니 페이지로 이동하는 로직을 여기에 추가할 수 있습니다
      console.log("장바구니 페이지로 이동");
    }
  });
};

// 이벤트 리스너 초기화 함수 (테스트용)
export const resetCartEventListeners = () => {
  cartEventListenersInitialized = false;
};
