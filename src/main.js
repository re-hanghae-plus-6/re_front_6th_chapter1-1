import FilterSection from "./components/filter/FilterSection.js";
import MainLayout from "./components/layout/MainLayout.js";
import ProductGrid from "./components/product/ProductGrid.js";
import { getProduct, getProducts, getCategories } from "./api/productApi.js";
import store from "./store/store.js";
import router from "./utils/router.js";
import ProductDetail from "./components/detail/ProductDetail.js";
// const , let 차이점
// const -> 값을 변경(재할당) 할 수 없음 , let -> 값을 변경(재할당) 할 수 있음.
const state = {
  products: [],
  total: 0,
  loading: false,
  categories: [],
  categoriesLoading: false,
  searchValue: "",
  selectCategory1: "",
  selectCategory2: "",
  selectedSort: "price_asc",
  selectedLimit: "20",
  currentPage: 1,
  hasMore: true,
  cartCount: 0,
};

export let render = async function (state) {
  const rootDOM = document.body.querySelector("#root");
  const path = window.location.pathname;
  const detailPage = path.match(/^\/product=(.+)$/);
  let html;

  if (path === "/" || path === "" || path.includes("limit") || path.includes("sort") || path.includes("searchValue")) {
    html = MainLayout({
      content: `
        ${FilterSection({
          searchValue: state.searchValue,
          categories: state.categories,
          selectedCategory1: state.selectCategory1,
          selectedCategory2: state.selectCategory2,
          sort: state.selectedSort,
          limit: state.selectedLimit,
          loading: state.categoriesLoading,
        })}
        ${ProductGrid({
          products: state.products,
          total: state.total,
          loading: state.loading,
          hasMore: state.hasMore,
        })}
        `,
        cartCount: state.cartCount,
        showBackButton: false,
        title: "쇼핑몰",
    });
  } else if (detailPage) {
    const productId = path.split("=")[1];
    const product = await getProduct(productId);
    state.productDetail = product;

    html = MainLayout({
      content: `${ProductDetail({ productInfo: product })}`,
      cartCount: state.cartCount,
      showBackButton: true,
      title: "상품 상세",
    });

  } else {
    html = '<h1>404</h1>';
  }
  rootDOM.innerHTML = html;
};

async function main() {
  state.loading = true;
  state.categoriesLoading = true;
  state.cartCount = localStorage.getItem("cartCount");
  render(state);
  
  const [
    {
      products,
      pagination: { total },
    },
    categories,
  ] = await Promise.all([
    getProducts({}),
    getCategories(),
  ]);

  store.setState({
    products,
    total,
    categories,
  });
  state.products = products;
  state.total = total;
  state.loading = false;
  state.categories = categories;
  state.categoriesLoading = false;
  render(state);
}

// 애플리케이션 시작
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => 
    worker.start(workerOptions)
  );
  
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

// // 상품 상세 페이지 HTML 생성 함수
// function createProductDetailPageHTML({ product, relatedProducts = [], quantity = 1 }) {
  
//   const {
//     productId,
//     image,
//     title,
//     lprice,
//     mallName = "",
//     // 가상의 추가 정보들
//     rating = 4.0,
//     reviewCount = 749,
//     stock = 107,
//     description = "",
//   } = product;

//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - Math.ceil(rating);

//     let stars = "";
//     for (let i = 0; i < fullStars; i++) {
//       stars += `
//         <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//         </svg>
//       `;
//     }
//     for (let i = 0; i < emptyStars; i++) {
//       stars += `
//         <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//         </svg>
//       `;
//     }
//     return stars;
//   };

//   const defaultDescription = `${title}에 대한 상세 설명입니다. ${mallName ? `${mallName}의` : ""} 우수한 품질을 자랑하는 상품으로, 고객 만족도가 높은 제품입니다.`;

//   return /* HTML */ `
//     <div class="bg-white rounded-lg shadow-sm mb-6">
//       <!-- 상품 이미지 -->
//       <div class="p-4">
//         <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
//           <img src="${image}" alt="${title}" class="w-full h-full object-cover product-detail-image" />
//         </div>
//         <!-- 상품 정보 -->
//         <div>
//           ${mallName ? `<p class="text-sm text-gray-600 mb-1">${mallName}</p>` : ""}
//           <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
//           <!-- 평점 및 리뷰 -->
//           <div class="flex items-center mb-3">
//             <div class="flex items-center">${renderStars(rating)}</div>
//             <span class="ml-2 text-sm text-gray-600">${rating} (${reviewCount}개 리뷰)</span>
//           </div>
//           <!-- 가격 -->
//           <div class="mb-4">
//             <span class="text-2xl font-bold text-blue-600">${parseInt(lprice).toLocaleString()}원</span>
//           </div>
//           <!-- 재고 -->
//           <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>
//           <!-- 설명 -->
//           <div class="text-sm text-gray-700 leading-relaxed mb-6">${description || defaultDescription}</div>
//         </div>
//       </div>
//       <!-- 수량 선택 및 액션 -->
//       <div class="border-t border-gray-200 p-4">
//         <div class="flex items-center justify-between mb-4">
//           <span class="text-sm font-medium text-gray-900">수량</span>
//           <div class="flex items-center">
//             <button
//               id="quantity-decrease"
//               class="w-8 h-8 flex items-center justify-center border border-gray-300 
//                            rounded-l-md bg-gray-50 hover:bg-gray-100"
//             >
//               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
//               </svg>
//             </button>
//             <input
//               type="number"
//               id="quantity-input"
//               value="${quantity}"
//               min="1"
//               max="${stock}"
//               class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
//                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             />
//             <button
//               id="quantity-increase"
//               class="w-8 h-8 flex items-center justify-center border border-gray-300 
//                            rounded-r-md bg-gray-50 hover:bg-gray-100"
//             >
//               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
//               </svg>
//             </button>
//           </div>
//         </div>
//         <!-- 액션 버튼 -->
//         <button
//           id="add-to-cart-btn"
//           data-product-id="${productId}"
//           class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
//                        hover:bg-blue-700 transition-colors font-medium"
//         >
//           장바구니 담기
//         </button>
//         <!-- 메시지 표시 영역 -->
//         <div id="cart-message" class="mt-3 text-center text-sm" style="display: none;"></div>
//       </div>
//     </div>
//     ${relatedProducts({ products: relatedProducts })}
//   `;
// }

function attachEventListeners() {
  // 렌더링 후에도 동작하도록 이벤트 위임 사용

  // 카테고리1
  document.querySelectorAll("[data-category1]:not([data-category2])").forEach((btn) => {
    btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: "",
        currentPage: 1,
      });
      if (e.target.matches("[data-category1]:not([data-category2])")) {
        const category1 = e.target.getAttribute("data-category1");
        router.navigateTo(`/category1=${encodeURIComponent(category1)}`);
      }
    };
  });

  // 카테고리2
  document.querySelectorAll("[data-category2]").forEach((btn) => {
    btn.onclick = (e) => {
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: e.target.getAttribute("data-category2"),
        currentPage: 1,
      });
      // 2depth 카테고리
      if (e.target.matches("[data-category2]")) {
        const category1 = e.target.getAttribute("data-category1");
        const category2 = e.target.getAttribute("data-category2");
        router.navigateTo(`/category1=${encodeURIComponent(category1)}&category2=${encodeURIComponent(category2)}`);
      }
    };
  });

  // 브레드크럼 category1
  const bcCategory1Btn = document.querySelector("[data-breadcrumb='category1']");
  if (bcCategory1Btn) {
    bcCategory1Btn.onclick = (e) => {
      // getAttribute가 null일 때 부모 노드에서 찾도록 보완
      let category1 = e.target.getAttribute("data-category1");
      if (!category1 && e.target.closest("[data-category1]")) {
        category1 = e.target.closest("[data-category1]").getAttribute("data-category1");
      }
      if (category1) {
        router.navigateTo(`/category1=${encodeURIComponent(category1)}`);
      }
      store.setState({
        selectedCategory1: e.target.getAttribute("data-category1"),
        selectedCategory2: "",
        currentPage: 1,
      });
    };
  }
  
  // 개수 옵션(페이지당 상품 수) 변경 시 라우터 이동
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.onchange = (e) => {
      const newLimit = e.target.value;
      fetchProducts({ limit: newLimit });
      store.setState({
        limit: Number(newLimit),
        currentPage: 1,
      });

      // 현재 선택된 카테고리, 정렬, 검색어 등 상태값을 가져와서 쿼리스트링 구성
      const state = store.getState();
      router.navigateTo(`/limit=${encodeURIComponent(state.limit)}`);
    };
  }

  // 개수 옵션(페이지당 상품 수) 변경 시 라우터 이동
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      const newSort = e.target.value;
      fetchProducts({ sort: newSort });
      store.setState({
        sort: newSort,
        currentPage: 1,
      });
      // 현재 선택된 카테고리, 정렬, 검색어 등 상태값을 가져와서 쿼리스트링 구성
      const state = store.getState();
      
      router.navigateTo(`/sort=${encodeURIComponent(state.sort)}`);
    };
  }


  // 상품명 검색 입력 필드(Enter 키로 검색)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      const searchValue = e.target.value.trim();
        if (searchValue !== "") {
        if (e.key === "Enter") {

          fetchProducts({ search: searchValue });
          store.setState({
            searchValue,
            currentPage: 1,
          });

          router.navigateTo(`/search=${encodeURIComponent(searchValue)}`);
        }
      }
    });
    
    document.body.addEventListener("click", (e) => {
      if (!e._productLinkHandled) {
        const link = e.target.closest("[data-product-link]");
        if (link) {
          e.preventDefault();
          e._productLinkHandled = true;
          const productId = link.getAttribute("data-product-link");
          store.setState({ productId })
          router.navigateTo(`/product=${productId}`);
        }
      }
    });



  // 무한 스크롤(인피니트 스크롤) 이벤트
  // let isLoading = false;
  // let hasMore = true;

  // const handleScroll = async () => {
  //   if (isLoading || !hasMore) return;
  //   const scrollY = window.scrollY || window.pageYOffset;
  //   const viewportHeight = window.innerHeight;
  //   const fullHeight = document.documentElement.scrollHeight;

  //   // 스크롤이 바닥에 거의 도달했을 때(여유 100px)
  //   if (scrollY + viewportHeight >= fullHeight - 100) {
  //     isLoading = true;
  //     const state = store.getState();
  //     const nextPage = (state.currentPage || 1) + 1;
  //     console.log(state);
  //     console.log(nextPage);
  //     // 전체 상품 수보다 이미 다 불러왔으면 중단
  //     if (state.products && state.products.length >= state.total) {
  //       hasMore = false;
  //       return;
  //     }
  //     // await fetchProducts({
  //     //   limit: state.limit,
  //     //   sort: state.sort,
  //     //   search: state.searchValue,
  //     //   page: nextPage,
  //     // });
  //     store.setState({ currentPage: nextPage });
  //     isLoading = false;
  //   }
  // };

  // window.addEventListener("scroll", handleScroll);
  }

  // 장바구니 담기 버튼 클릭 시 cartCount 증가
  // 이벤트 위임 방식으로, 클릭된 버튼 하나에 대해서만 동작하게 처리
  // 기존 cartContainer 이벤트 리스너가 중복 등록되는 문제 방지
  const cartContainer = document.getElementById("product-list") || document.body;
  if (cartContainer._cartListenerAttached !== true) {
    cartContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart-btn");
      if (btn) {
        e.preventDefault();
        let cartCount = Number(localStorage.getItem("cartCount")) || 0;
        const newCartCount = cartCount + 1;
        localStorage.setItem("cartCount", newCartCount);
        store.setState({ cartCount: newCartCount });
        const state = store.getState();
        render(state);
      }
    });
    cartContainer._cartListenerAttached = true;
  }

}

// 렌더 후마다 핸들러 재연결
const originalRender = render;
render = function (...args) {
  const result = originalRender.apply(this, args);
  attachEventListeners();
  return result;
};

const fetchProducts = async ({ limit = 20, sort = "price_asc", search = "" }) => {
  state.loading = true;

  try {
    const { 
      products,
      pagination: { total },
    } = await getProducts({
      limit,
      sort,
      search,
    });
    state.products = products;
    state.total = total;
    state.loading = false;
    render(state);
  } catch (error) {
    state.loading = false;
    console.log(error);
  }
};