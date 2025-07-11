import { fetchProducts } from "../entities/products";
import { cartStore, productDetailStore, productsStore } from "../store";
import { navigate } from "./navigate";
import LocalStorageUtil from "../localstorage";
import LOCAL_STORAGE_KEY from "../constant/localstorageKey";
import { showToast } from "../components/common/Toast";

export const bindAllEvents = () => {
  const params = new URLSearchParams(window.location.search);

  // 상품 리스트 개수 Limit 선택 이벤트
  const limitSelectElement = document.getElementById("limit-select");
  if (limitSelectElement) {
    limitSelectElement.value = productsStore.state.pagination.limit + "";
    limitSelectElement.onchange = (e) => {
      const limit = Number(e.target.value);
      params.set("limit", limit);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

      fetchProducts({
        ...productsStore.state.pagination,
        limit,
        page: 1, // 보통 첫 페이지로 초기화
      });
    };
  }

  // 상품 리스트 정렬 선택 이벤트
  const sortSelectElement = document.getElementById("sort-select");
  if (sortSelectElement) {
    sortSelectElement.value = productsStore.state.filters.sort + "";
    sortSelectElement.onchange = (e) => {
      const sort = e.target.value;
      params.set("sort", sort);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
      fetchProducts({ sort });
    };
  }

  // 상품 리스트 검색 이벤트
  const searchInputElement = document.getElementById("search-input");
  if (searchInputElement) {
    const searchValue = params.get("search") || "";
    searchInputElement.value = searchValue;

    searchInputElement.onkeydown = (e) => {
      if (e.key === "Enter") {
        const search = e.target.value;

        params.set("search", search);
        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

        fetchProducts({ search, page: 1 }); // 보통 검색 시 첫 페이지로 초기화
      }
    };
  }

  // 상품 리스트에서 상품 클릭시 상세페이지로 이동 이벤트
  const productItemElements = document.querySelectorAll(".product-card");
  if (productItemElements) {
    productItemElements.forEach((element) => {
      element.addEventListener("click", () => {
        const productId = element.dataset.productId;
        navigate(`/product/${productId}`);
      });
    });
  }

  // 상품 리스트에서 장바구니 담기 버튼 클릭 이벤트
  const addToCartBtnElements = document.querySelectorAll(".add-to-cart-btn");
  if (addToCartBtnElements) {
    addToCartBtnElements.forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        const productId = element.dataset.productId;
        const product = {
          productId,
          title: element.dataset.productTitle,
          image: element.dataset.productImage,
          lprice: element.dataset.productPrice,
          quantity: 1,
          selected: false,
        };
        const carts = LocalStorageUtil.getItem(LOCAL_STORAGE_KEY.CARTS) || [];
        console.log("durlwfdsa", carts);
        const existingIndex = carts.findIndex((cart) => cart.productId === productId);

        if (existingIndex > -1) {
          // 이미 존재하면 수량만 증가
          carts[existingIndex].quantity += quantity;
        } else {
          // 존재하지 않으면 새로 추가
          carts.push(product);
        }
        LocalStorageUtil.setItem(LOCAL_STORAGE_KEY.CARTS, carts);
        cartStore.setState({
          cartsProductCount: carts.length,
        });
        showToast("success", "장바구니에 추가되었습니다");
      });
    });
  }

  // 상품 상세페이지 장바구니 수량 선택 이벤트
  let quantity = 1;
  const maxQuantity = productDetailStore.state.productDetail.stock;
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");
  const quantityInput = document.getElementById("quantity-input");

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
      }
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      if (quantity < maxQuantity) {
        quantity++;
      }
      quantityInput.value = quantity;
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener("input", () => {
      let value = parseInt(quantityInput.value, 10);
      if (isNaN(value) || value < 1) value = 1;
      if (value > maxQuantity) value = maxQuantity;
      quantity = value;
      quantityInput.value = quantity;
    });
  }

  // 상품상세페이지 장바구니 담기 이벤트;
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    const { productId, image, lprice, title } = productDetailStore.state.productDetail;

    const product = {
      productId,
      image,
      lprice,
      title,
      quantity,
      selected: false,
    };

    addToCartBtn.addEventListener("click", () => {
      const carts = LocalStorageUtil.getItem(LOCAL_STORAGE_KEY.CARTS) || [];

      const existingIndex = carts.findIndex((cart) => cart.productId === productId);

      if (existingIndex > -1) {
        // 이미 존재하면 수량만 증가
        carts[existingIndex].quantity += quantity;
      } else {
        // 존재하지 않으면 새로 추가
        carts.push(product);
      }
      LocalStorageUtil.setItem(LOCAL_STORAGE_KEY.CARTS, carts);
      cartStore.setState({
        cartsProductCount: carts.length,
      });
      showToast("success", "장바구니에 추가되었습니다");
      // 수량 초기화
      quantity = 1;
      quantityInput.value = quantity;
    });
  }

  // 관련상품 상세페이지로 이동 이벤트
  const relatedProductItemElements = document.querySelectorAll(".related-product-card");
  if (relatedProductItemElements) {
    relatedProductItemElements.forEach((element) => {
      element.addEventListener("click", () => {
        const productId = element.dataset.productId;
        navigate(`/product/${productId}`);
      });
    });
  }
};
