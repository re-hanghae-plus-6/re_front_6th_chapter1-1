import { navigateToDetail } from "../routes/router";
import { addCart } from "../store/localState";

export const productCardClickHandler = (e) => {
  if (e.target.closest(".add-to-cart-btn")) return;
  const card = e.target.closest(".product-card");
  if (card) {
    const productId = card.getAttribute("data-product-id");
    navigateToDetail(productId);
    console.log("발동");
  }
};

export const CartClickHandler = (e) => {
  if (e.target.matches(".add-to-cart-btn")) {
    e.stopPropagation();
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const product = {
        productId: e.target.getAttribute("data-product-id"),
        title: productCard.querySelector("h3").textContent,
        image: productCard.querySelector("img").src,
        price: productCard.querySelector(".text-lg").textContent.replace("원", "").replace(",", ""),
      };
      addCart(product);
    }
  }
};

// 디테일들어와서
export const detailClickHandler = (e) => {
  const quantityInput = document.querySelector("#quantity-input");
  if (!quantityInput) return;

  if (e.target.closest("#quantity-decrease")) {
    let current = parseInt(quantityInput.value);
    if (current > 1) {
      quantityInput.value = current - 1;
    }
    console.log("마이너스");
  }

  if (e.target.closest("#quantity-increase")) {
    let current = parseInt(quantityInput.value);
    quantityInput.value = current + 1;
    console.log("플러스");
  }
};

export const cartClickHandler = async (e) => {
  if (e.target.matches("#add-to-cart-btn")) {
    console.log("장바구니 버튼 클릭됨");

    const productId = e.target.getAttribute("data-product-id");

    try {
      const res = await fetch(`/api/products/${productId}`);
      const productData = await res.json();

      const quantityInput = document.querySelector("#quantity-input");
      const quantity = quantityInput ? quantityInput.value : 1;

      const product = {
        productId: productData.productId,
        title: productData.title,
        image: productData.image,
        price: productData.lprice.toLocaleString(),
        quantity: parseInt(quantity),
      };
      addCart(product, quantity);

      const toast = document.getElementById("cart-toast");
      if (toast) {
        toast.classList.remove("hidden");
        toast.classList.add("opacity-100");

        setTimeout(() => {
          toast.classList.add("opacity-0");
          setTimeout(() => {
            toast.classList.remove("opacity-100", "opacity-0");
            toast.classList.add("hidden");
          }, 500);
        }, 3000);
      }

      if (quantityInput) quantityInput.value = 1;
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
    }
  }
};

export const relatedClickHandler = (e) => {
  const card = e.target.closest(".related-product-card");
  console.log("관련");
  if (card) {
    const productId = card.getAttribute("data-product-id");
    navigateToDetail(productId);
  }
};
//   root.addEventListener("click", (e) => {
//     if (e.target.matches(".add-to-cart-btn")) {
//       e.stopPropagation();
//       const productCard = e.target.closest(".product-card");
//       if (productCard) {
//         const product = {
//           productId: e.target.getAttribute("data-product-id"),
//           title: productCard.querySelector("h3").textContent,
//           image: productCard.querySelector("img").src,
//           price: productCard.querySelector(".text-lg").textContent.replace("원", "").replace(",", ""),
//         };
//         addCart(product);
//       }
//     }
//   });
