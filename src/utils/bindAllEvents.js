import { fetchProducts } from "../entities/products";
import { cartStore, productsStore } from "../store";
import { navigate } from "./navigate";

export const bindAllEvents = () => {
  // 상품 리스트 개수 Limit 선택 이벤트
  const limitSelectElement = document.getElementById("limit-select");
  if (limitSelectElement) {
    limitSelectElement.value = productsStore.state.pagination.limit + "";
    limitSelectElement.onchange = (e) => {
      const limit = Number(e.target.value);
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
      fetchProducts({ sort });
    };
  }

  // 상품 리스트 검색 이벤트
  const searchInputElement = document.getElementById("search-input");
  if (searchInputElement) {
    searchInputElement.onkeydown = (e) => {
      if (e.key === "Enter") {
        const search = e.target.value;
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
        const productTitle = element.dataset.productTitle;
        const productImage = element.dataset.productImage;
        const productPrice = element.dataset.productPrice;
        cartStore.setState({
          cartItems: [...cartStore.state.cartItems, { productId, productTitle, productImage, productPrice }],
        });
      });
    });
  }
};
