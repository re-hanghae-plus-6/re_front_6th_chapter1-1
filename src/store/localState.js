// {
//   "items": [
//     {
//       "id": "85067212996",
//       "title": "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장",
//       "image": "https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg",
//       "price": 220,
//       "quantity": 1,
//       "selected": false
//     }
//   ],
//   "selectedAll": false
// }

// {
//   "items": [
//     {
//       "id": "85067212996",
//       "title": "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장",
//       "image": "https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg",
//       "price": 220,
//       "quantity": 2,
//       "selected": false
//     },
//     {
//       "id": "86940857379",
//       "title": "샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이",
//       "image": "https://shopping-phinf.pstatic.net/main_8694085/86940857379.1.jpg",
//       "price": 230,
//       "quantity": 1,
//       "selected": false
//     }
//   ],
//   "selectedAll": false
// }

// {
//   "items": [
//     {
//       "id": "85067212996",
//       "title": "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장",
//       "image": "https://shopping-phinf.pstatic.net/main_8506721/85067212996.1.jpg",
//       "price": 220,
//       "quantity": 2,
//       "selected": false
//     },
//     {
//       "id": "86940857379",
//       "title": "샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이",
//       "image": "https://shopping-phinf.pstatic.net/main_8694085/86940857379.1.jpg",
//       "price": 230,
//       "quantity": 1,
//       "selected": false
//     }
//   ],
//   "selectedAll": false
// }

// {"items":[],"selectedAll":false}
export const localState = JSON.parse(localStorage.getItem("shopping_cart")) || {
  items: [],
  selectedAll: false,
};

export function addCart({ productId, title, image, price, quantity = 1 }) {
  const stored = localStorage.getItem("shopping_cart");
  const currentState = stored ? JSON.parse(stored) : { items: [], selectedAll: false };

  const existingItem = currentState.items.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    currentState.items.push({
      id: productId,
      title,
      image,
      price: Number(price),
      quantity: quantity,
      selected: false,
    });
  }

  // 저장
  localStorage.setItem("shopping_cart", JSON.stringify(currentState));

  // 🟢 장바구니 개수 UI 수동 갱신
  updateCartCountBadge(); // 이거 호출
}

export function updateCartCountBadge() {
  const stored = JSON.parse(localStorage.getItem("shopping_cart") || "{}");
  const count = stored.items?.length || 0;

  let badge = document.querySelector("#cart-icon-btn span");

  if (!badge && count > 0) {
    badge = document.createElement("span");
    badge.className =
      "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center";
    document.querySelector("#cart-icon-btn").appendChild(badge);
  }

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }
}
