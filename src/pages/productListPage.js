import { Header } from "../components/productList/layout/header.js";
import { Category } from "../components/productList/category/category.js";
import { Product } from "../components/productList/product/product.js";
import { ListLoadingIndicator } from "../components/productList/layout/listLoadingIndicator.js";
import { ListEndIndicator } from "../components/productList/layout/listEndindicator.js";
import { Footer } from "../components/productList/layout/footer.js";
import { SkeletonProduct } from "../components/productList/skeleton/skeletonProduct.js";
import { ProductGrid } from "../components/productList/layout/productGrid.js";
import { router } from "../router.js";
import { getCategories, getProducts } from "../api/productApi.js";
import { render } from "../render.js";
import { store } from "../store.js";
import { queryStringToObject, objectToQueryString } from "../utils/qs.js";
import { addToCart } from "../entity/cart.js";
import { openToast } from "../utils/toast.js";
import { SuccessToast } from "../components/toast/successToast.js";
import { CartModal } from "../components/cart/modal/cartModal.js";
import { ModalContents } from "../components/cart/modalContents/modalContents.js";
import { findParentByTag } from "../utils/dom.js";
import { localeStringToNumber } from "../utils/number.js";
import { InfoToast } from "../components/toast/infoToast.js";

const state = {
  products: [],
  filters: {},
  pagination: {},
  categoryLoading: false,
  productLoading: false,
  categories: {},
  productCountLimit: 20,
  isEnd: false,
};

export const ProductListPage = () => {
  const { productCountLimit, pagination } = state;
  const limit = Number(new URL(window.location.href).searchParams.get("limit") || productCountLimit);
  const sort = new URL(window.location.href).searchParams.get("sort") || "price_asc";
  const search = new URL(window.location.href).searchParams.get("search") || "";
  const page = pagination.page;
  const [mounted, setMounted] = store.useState("mounted");

  if (mounted === false) {
    state.productLoading = true;
    state.categoryLoading = true;

    Promise.all([
      getProducts({ limit, sort, page, search }).then((data) => {
        state.productLoading = false;
        state.products = data.products;
        state.pagination = data.pagination;
        state.filters = data.filters;
        state.isEnd = data.pagination.total <= state.products.length;
      }),
      getCategories().then((data) => {
        state.categoryLoading = false;
        state.categories = data;
      }),
    ]).then(() => {
      setMounted(true);
      render();
    });
  }

  return `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title: "쇼핑몰", cartItemCount: store.getState("cartItems").length })}
      <main class="max-w-md mx-auto px-4 py-4">
      ${Category({ state })}
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
          <!-- 상품 개수 정보 -->
          ${
            state.productLoading
              ? ""
              : `<div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${state.pagination.total}개</span>의 상품
            </div>`
          }
            <!-- 상품 그리드 -->
            ${ProductGrid({
              children: `
              ${
                (state.products ?? []).length > 0
                  ? `${state.products.map((product) => Product(product)).join("")}`
                  : SkeletonProduct.repeat(4)
              }
              `,
            })}
            <div id="product-list-end-indicator" style="height: 100px;">
              ${state.isEnd ? ListEndIndicator : ListLoadingIndicator}
            </div>
          </div>
        </div>
      </main>
      ${Footer}
</div>
${store.getState("isCartModalOpen") ? CartModal({ children: ModalContents({ cartItems: store.getState("cartItems") }) }) : ""}
${SuccessToast({ message: "장바구니에 추가되었습니다" })}
${InfoToast({ message: "장바구니에서 삭제되었습니다" })}
`;
};

ProductListPage.state = state;

ProductListPage.registerEvent = () => {
  const limitSelect = document.getElementById("limit-select");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");
  const productCards = document.querySelectorAll(".product-card");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartIconBtn = document.getElementById("cart-icon-btn");
  const cartModalCloseBtn = document.getElementById("cart-modal-close-btn");
  const cartModalOverlay = document.getElementById("cart-modal-overlay");
  const cartQuantityDecreaseBtn = document.querySelectorAll(".quantity-decrease-btn");
  const cartQuantityIncreaseBtn = document.querySelectorAll(".quantity-increase-btn");
  const cartQuantityInputs = document.querySelectorAll(".quantity-input");
  const cartModalTotalPrice = document.getElementById("cart-modal-total-price");
  const cartItemPrices = document.querySelectorAll(".cart-item-price");
  const cartItemLprices = document.querySelectorAll(".cart-item-lprice");
  const cartItemRemoveBtns = document.querySelectorAll(".cart-item-remove-btn");
  const cartModalClearCartBtn = document.getElementById("cart-modal-clear-cart-btn");

  if (cartModalClearCartBtn) {
    cartModalClearCartBtn.addEventListener("click", () => {
      store.setState("cartItems", [], { persist: true });
      render();
      openToast({ message: "장바구니가 비워졌습니다", type: "info" });
    });
  }

  cartItemRemoveBtns.forEach((cartItemRemoveBtn) => {
    cartItemRemoveBtn.addEventListener("click", (event) => {
      const button = findParentByTag(event.target, "BUTTON");
      const productId = button.dataset.productId;
      console.log(productId);

      let cartItems = store.getState("cartItems");
      cartItems = cartItems.filter((cartItem) => cartItem.productId !== productId);
      store.setState("cartItems", cartItems, { persist: true });

      render();
      openToast({ message: "장바구니에서 삭제되었습니다", type: "info" });
    });
  });

  cartQuantityDecreaseBtn.forEach((cartQuantityDecreaseBtn) => {
    cartQuantityDecreaseBtn.addEventListener("click", (event) => {
      const button = findParentByTag(event.target, "BUTTON");
      const productId = button.dataset.productId;
      const currentInput = Array.from(cartQuantityInputs).find((input) => input.dataset.productId === productId);

      if (Number(currentInput.value) > 1) {
        const quantity = Number(currentInput.value) - 1;
        currentInput.value = quantity;

        let cartItems = store.getState("cartItems");
        cartItems = cartItems.map((cartItem) => {
          if (cartItem.productId === productId) {
            return { ...cartItem, quantity: quantity };
          }
          return cartItem;
        });
        store.setState("cartItems", cartItems, { persist: true });

        const currentItemPriceTag = Array.from(cartItemPrices).find((price) => price.dataset.productId === productId);
        const currentItemLprice = localeStringToNumber(
          Array.from(cartItemLprices).find((price) => price.dataset.productId === productId).textContent,
        );

        const currentItemTotalPrice = currentItemLprice * quantity;
        currentItemPriceTag.innerHTML = currentItemTotalPrice.toLocaleString("ko-KR") + "원";
        cartModalTotalPrice.textContent =
          (Number(localeStringToNumber(cartModalTotalPrice.textContent)) - currentItemLprice).toLocaleString("ko-KR") +
          "원";
      }
    });
  });

  cartQuantityIncreaseBtn.forEach((cartQuantityIncreaseBtn) => {
    cartQuantityIncreaseBtn.addEventListener("click", (event) => {
      const button = findParentByTag(event.target, "BUTTON");
      const productId = button.dataset.productId;
      const currentInput = Array.from(cartQuantityInputs).find((input) => input.dataset.productId === productId);

      if (Number(currentInput.value)) {
        const quantity = Number(currentInput.value) + 1;
        currentInput.value = quantity;

        let cartItems = store.getState("cartItems");
        cartItems = cartItems.map((cartItem) => {
          if (cartItem.productId === productId) {
            return { ...cartItem, quantity: quantity };
          }
          return cartItem;
        });
        store.setState("cartItems", cartItems, { persist: true });

        const currentItemPriceTag = Array.from(cartItemPrices).find((price) => price.dataset.productId === productId);
        const currentItemLprice = localeStringToNumber(
          Array.from(cartItemLprices).find((price) => price.dataset.productId === productId).textContent,
        );

        const currentItemTotalPrice = currentItemLprice * quantity;
        currentItemPriceTag.innerHTML = currentItemTotalPrice.toLocaleString("ko-KR") + "원";
        cartModalTotalPrice.textContent =
          (Number(localeStringToNumber(cartModalTotalPrice.textContent)) + currentItemLprice).toLocaleString("ko-KR") +
          "원";
      }
    });
  });

  cartIconBtn.addEventListener("click", () => {
    store.setState("isCartModalOpen", true);
    render();
  });

  if (cartModalCloseBtn) {
    cartModalCloseBtn.addEventListener("click", () => {
      store.setState("isCartModalOpen", false);
      render();
    });
  }

  if (cartModalOverlay) {
    cartModalOverlay.addEventListener("click", () => {
      store.setState("isCartModalOpen", false);
      render();
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      store.setState("isCartModalOpen", false);
      render();
    }
  });

  productCards.forEach((productCard) => {
    productCard.addEventListener("click", () => {
      router.push(`/product/${productCard.dataset.productId}`);
    });
  });

  addToCartButtons.forEach((addToCartButton) => {
    addToCartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const product = state.products.find((product) => product.productId === event.target.dataset.productId);
      addToCart(product, 1);
      openToast({ message: "장바구니에 추가되었습니다", type: "success" });
    });
  });

  limitSelect.addEventListener("change", (event) => {
    const url = new URL(window.location.href);
    const queryString = objectToQueryString({
      ...queryStringToObject(url.search),
      limit: event.target.value,
    });

    router.push(`${url.pathname}?${queryString}`);
  });

  sortSelect.addEventListener("change", (event) => {
    const url = new URL(window.location.href);
    const queryString = objectToQueryString({
      ...queryStringToObject(url.search),
      sort: event.target.value,
    });

    router.push(`${url.pathname}?${queryString}`);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const url = new URL(window.location.href);
    const queryString = objectToQueryString({
      ...queryStringToObject(url.search),
      search: event.target.value,
    });

    router.push(`${url.pathname}?${queryString}`);
  });

  const productListEndIndicator = document.getElementById("product-list-end-indicator");
  let moreLoading = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !moreLoading) {
          moreLoading = true;
          state.pagination.page++;
          io.unobserve(productListEndIndicator);

          const limit = state.pagination.limit;
          const sort = state.filters.sort;
          const page = state.pagination.page;
          const search = state.filters.search;

          getProducts({ limit, sort, page, search })
            .then((data) => {
              state.productLoading = false;
              state.products = [...state.products, ...data.products];
              state.pagination = data.pagination;
              state.filters = data.filters;
              state.isEnd = data.pagination.total <= state.products.length;
            })
            .then(() => {
              moreLoading = false;
              render();
            });
        }
      });
    },
    { threshold: 0.7 },
  );

  io.observe(productListEndIndicator);
};
