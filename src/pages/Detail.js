import { getProduct, getProducts } from "../api/productApi";
import { formatPrice } from "../utils/formatPrice";
import { cartStore } from "../store/store.js";

class Detail {
  constructor() {
    this.el = null;
    this.state = {
      product: null,
      relatedProducts: [],
      quantity: 1,
      loading: true,
    };
  }

  async fetchProductDetails() {
    const productId = location.hash.split("/")[1];
    try {
      const [product, allProducts] = await Promise.all([getProduct(productId), getProducts()]);
      this.setState({
        product,
        relatedProducts: allProducts.filter((p) => p.id !== productId).slice(0, 19),
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
      this.setState({ loading: false });
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.el) {
      const oldEl = this.el;
      const newEl = this.render();
      if (oldEl.parentNode) {
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
      this.el = newEl;
    }
  }

  template() {
    if (this.state.loading) {
      return `<div>Loading...</div>`;
    }

    if (!this.state.product) {
      return `<div>Product not found</div>`;
    }

    const { name, price, imageUrl, description } = this.state.product;

    return `
      <main class="p-4">
        <h1 class="text-2xl font-bold">상품 상세</h1>
        <hr class="my-4">
  
        <div>
          <a href="#/">목록으로</a>
        </div>
  
        <div id="product-image-container" class="my-4">
          <img src="${imageUrl}" alt="${name}">
        </div>
  
        <div id="product-info-container">
          <h1 class="text-2xl font-bold">${name}</h1>
          <p id="product-price" class="text-xl font-bold my-2">${formatPrice(price)}원</p>
          <p id="product-description">${description}</p>
        </div>
  
        <div id="product-interaction-container" class="my-4">
          <div class="flex items-center space-x-2">
            <button id="quantity-decrease" class="px-3 py-1 border border-gray-300 rounded-md">-</button>
            <input id="quantity-input" type="number" value="${this.state.quantity}" min="1" class="w-16 text-center border border-gray-300 rounded-md">
            <button id="quantity-increase" class="px-3 py-1 border border-gray-300 rounded-md">+</button>
          </div>
          <button id="add-to-cart-btn" class="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">장바구니 담기</button>
        </div>

        <hr class="my-4">

        <div>
            <h2 class="text-xl font-bold">관련 상품</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                ${this.state.relatedProducts
                  .map(
                    (p) => `
                    <div class="related-product-card border p-2 rounded-md" data-product-id="${p.id}">
                        <a href="#/product/${p.id}">
                            <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-32 object-cover">
                            <h3 class="mt-2 text-sm font-bold">${p.name}</h3>
                            <p class="text-xs">${formatPrice(p.price)}원</p>
                        </a>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
      </main>
    `;
  }

  render() {
    let newEl = this.el;
    if (!newEl) {
      newEl = document.createElement("div");
    }
    newEl.innerHTML = this.template();
    this.el = newEl;
    this.addEventListeners();
    return this.el;
  }

  addEventListeners() {
    // const $quantityInput = this.el.querySelector("#quantity-input");
    const $increaseBtn = this.el.querySelector("#quantity-increase");
    const $decreaseBtn = this.el.querySelector("#quantity-decrease");
    const $addToCartBtn = this.el.querySelector("#add-to-cart-btn");

    if ($increaseBtn) {
      $increaseBtn.addEventListener("click", () => {
        this.setState({ quantity: this.state.quantity + 1 });
      });
    }

    if ($decreaseBtn) {
      $decreaseBtn.addEventListener("click", () => {
        if (this.state.quantity > 1) {
          this.setState({ quantity: this.state.quantity - 1 });
        }
      });
    }

    if ($addToCartBtn) {
      $addToCartBtn.addEventListener("click", () => {
        const productToAdd = {
          ...this.state.product,
          productId: this.state.product.id,
          lprice: this.state.product.price,
        };
        cartStore.addItem(productToAdd);
        const $message = document.createElement("div");
        $message.textContent = "장바구니에 추가되었습니다";
        $message.className = "fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg";
        document.body.appendChild($message);
        setTimeout(() => {
          document.body.removeChild($message);
        }, 2000);
      });
    }
  }

  init() {
    this.fetchProductDetails();
    return this.render();
  }
}

export default Detail;
