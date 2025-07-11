import { getProduct, getProducts } from "../api/productApi";
import { cartStore } from "../store/store.js";
import { router } from "../router/router.js";
import toast from "../components/Toast.js";

class Detail {
  constructor(options = {}) {
    this.el = null;
    this.state = {
      product: null,
      relatedProducts: [],
      quantity: 1,
      loading: true,
      productId: options.productId,
    };
    this.relatedProductsTimeout = null;
  }

  resetState() {
    this.state = {
      product: null,
      relatedProducts: [],
      quantity: 1,
      loading: true,
      productId: this.state.productId,
    };
    // 기존 엘리먼트도 초기화
    this.el = null;
  }

  async fetchProductDetails() {
    const { productId } = this.state;
    if (!productId) {
      this.setState({ loading: false });
      return;
    }
    try {
      const [fetchedProduct, allProducts] = await Promise.all([getProduct(productId), getProducts()]);

      const product = {
        productId: fetchedProduct.productId,
        title: fetchedProduct.title,
        image: fetchedProduct.image,
        lprice: fetchedProduct.lprice,
        rating: fetchedProduct.rating || 0,
        category1: fetchedProduct.category1 || "",
        category2: fetchedProduct.category2 || "",
        category3: fetchedProduct.category3 || "",
        category4: fetchedProduct.category4 || "",
        stock: fetchedProduct.stock || 0,
        reviewCount: fetchedProduct.reviewCount || 0,
        description: fetchedProduct.description || "",
      };

      this.setState({
        product,
        loading: false,
        relatedProducts: [],
      });

      this.relatedProductsTimeout = setTimeout(() => {
        const relatedProducts = allProducts.products.filter((p) => p.productId !== productId).slice(0, 19);
        this.setState({
          relatedProducts,
        });
      }, 10);
    } catch (error) {
      console.error("상품 상세 정보를 가져오는 중 오류가 발생했습니다.", error);
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
      return `<div class="py-20 bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>`;
    }

    if (!this.state.product) {
      return `<div>Product not found</div>`;
    }

    const { title, image, lprice, description, rating, productId } = this.state.product;

    // 관련 상품 섹션을 조건부로 렌더링
    const relatedProductsSection =
      this.state.relatedProducts && this.state.relatedProducts.length > 0
        ? `<!-- 관련 상품 -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
              <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 gap-3 responsive-grid">
                  ${this.state.relatedProducts
                    .map(
                      (p) => `
              <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${p.productId}">
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover" loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${p.title}</h3>
                <p class="text-sm font-bold text-blue-600">${parseInt(p.lprice).toLocaleString()}원</p>
              </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
          </div>`
        : "";

    // 브레드크럼 생성 함수
    const generateBreadcrumb = () => {
      const categories = [this.state.product.category1, this.state.product.category2].filter(Boolean); // 빈 값 제거

      let breadcrumbHTML = `
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
      `;

      categories.forEach((category, index) => {
        breadcrumbHTML += `
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category-index="${index + 1}" data-category-value="${category}">
            ${category}
          </button>
        `;
      });

      return breadcrumbHTML;
    };

    return `
        <!-- 브레드크럼 -->
        <nav class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            ${generateBreadcrumb()}
          </div>
        </nav>
        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
               <img src="${image}" alt="${title}">
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1"></p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  ${Array(rating)
                    .fill(0)
                    .map(
                      () => `
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `,
                    )
                    .join("")}
                  ${Array(5 - rating)
                    .fill(0)
                    .map(
                      () => `
                    <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  `,
                    )
                    .join("")}
                </div>
                <span class="ml-2 text-sm text-gray-600">${this.state.product.rating}.0 (${this.state.product.reviewCount}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${parseInt(lprice).toLocaleString()}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">
                재고 ${this.state.product.stock}개
              </div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">
                ${description}
              </div>
            </div>
          </div>
          <!-- 수량 선택 및 액션 -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-900">수량</span>
              <div class="flex items-center">
                <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-l-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <input type="number" id="quantity-input" value="${this.state.quantity}" min="1" max="${this.state.product.stock}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-r-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            <!-- 액션 버튼 -->
            <button id="add-to-cart-btn" data-product-id="${productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium">
              장바구니 담기
            </button>
          </div>
        </div>
  
        <!-- 상품 목록으로 이동 -->
        <div class="mb-6">
          <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
            상품 목록으로 돌아가기
          </button>
        </div>

        ${relatedProductsSection}
    `;
  }

  render() {
    let newEl = this.el;
    if (!newEl) {
      newEl = document.createElement("main");
      newEl.className = "max-w-md mx-auto px-4 py-4";
    }
    newEl.innerHTML = this.template();
    this.el = newEl;
    this.addEventListeners();
    return this.el;
  }

  addEventListeners() {
    const $quantityInput = this.el.querySelector("#quantity-input");
    const $increaseBtn = this.el.querySelector("#quantity-increase");
    const $decreaseBtn = this.el.querySelector("#quantity-decrease");
    const $addToCartBtn = this.el.querySelector("#add-to-cart-btn");
    const $goToProductListBtn = this.el.querySelector(".go-to-product-list");

    if ($goToProductListBtn) {
      $goToProductListBtn.addEventListener("click", () => {
        window.history.back();
      });
    }

    this.el.querySelectorAll(".breadcrumb-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const categoryIndex = parseInt(link.dataset.categoryIndex);

        const params = new URLSearchParams();

        const categories = [this.state.product.category1, this.state.product.category2].filter(Boolean);
        for (let i = 0; i < categoryIndex; i++) {
          if (categories[i]) {
            params.set(`category${i + 1}`, categories[i]);
          }
        }

        const url = `/?${params.toString()}`;
        history.pushState({}, "", url);

        window.dispatchEvent(new CustomEvent("urlchange"));

        router();
      });
    });

    if ($quantityInput) {
      $quantityInput.addEventListener("input", (e) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) {
          this.setState({ quantity: 1 });
        } else if (value > this.state.product.stock) {
          this.setState({ quantity: this.state.product.stock });
        } else {
          this.setState({ quantity: value });
        }
      });
    }

    if ($increaseBtn) {
      $increaseBtn.addEventListener("click", () => {
        if (this.state.quantity < this.state.product.stock) {
          this.setState({ quantity: this.state.quantity + 1 });
        }
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
          productId: this.state.product.productId,
          title: this.state.product.title,
          lprice: this.state.product.lprice,
          image: this.state.product.image,
        };

        for (let i = 0; i < this.state.quantity; i++) {
          cartStore.addItem(productToAdd);
        }

        toast.showSuccess("장바구니에 추가되었습니다");
      });
    }

    this.el.querySelectorAll(".related-product-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = card.dataset.productId;
        history.pushState({}, "", `/product/${productId}`);
        window.dispatchEvent(new CustomEvent("urlchange"));

        router();
      });
    });
  }

  async init() {
    if (this.relatedProductsTimeout) {
      clearTimeout(this.relatedProductsTimeout);
      this.relatedProductsTimeout = null;
    }

    this.resetState();

    // 라우터가 안정화될 때까지 대기
    await new Promise((resolve) => setTimeout(resolve, 50));

    await this.fetchProductDetails();

    return this.render();
  }

  destroy() {
    if (this.relatedProductsTimeout) {
      clearTimeout(this.relatedProductsTimeout);
      this.relatedProductsTimeout = null;
    }
    this.el = null;
  }
}

export default Detail;
