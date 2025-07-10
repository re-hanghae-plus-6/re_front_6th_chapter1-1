import { getCategories, getProducts } from "../api/productApi";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductList from "../components/ProductList";
import Search from "../components/Search";
import useNavigate from "../core/useNavigate";
import useRender from "../core/useRender";
import useStore from "../core/useStore";

const store = useStore();
const navigate = useNavigate();
const state = {
  isLoading: true,
  products: [],
  pagination: {},
  categories: {},
};

const fetchProducts = async (params = {}) => {
  state.isLoading = true;
  const productData = await getProducts(params);
  state.isLoading = false;

  // 무한 스크롤 방식 구현으로 누적된 product 값
  if (params.page && params.page > 1) {
    state.products = [...state.products, ...productData.products];
  } else {
    state.products = productData.products;
  }

  state.pagination = productData.pagination;
};

const fetchCategories = async () => {
  const categoriesData = await getCategories();
  state.categories = categoriesData;
};

// const loadMoreProducts = (trigger, callback) => {
//   const io = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           callback();
//         }
//       });
//     },
//     {
//       root: null,
//       rootMargin: "0px",
//       threshold: 1.0,
//     },
//   );

//   io.observe(trigger);
// };

// const loadMoreProductsCallback = () => {
//   const currentPage = store.get("params")["page"];
//   const hasNextPage = state.pagination.hasNext;
//   if (!hasNextPage) return;
//   const render = useRender();
//   const nextPage = currentPage + 1;

//   fetchProducts({ ...store.get("params"), page: nextPage }).then(({ categories }) => {
//     render.draw(
//       "main",
//       Home({
//         products: state.products,
//         pagination: state.pagination,
//         isLoading: state.isLoading,
//         categories,
//       }),
//     );

//     Search.mount();
//     ProductCard.mount();

//     setTimeout(() => {
//       const trigger = document.getElementById("scroll-trigger");
//       if (trigger) {
//         loadMoreProducts(trigger, loadMoreProductsCallback);
//       }
//     }, 200);
//   });
// };

Home.mount = async () => {
  const render = useRender();
  await fetchProducts();
  await fetchCategories();

  render.draw(
    "main",
    Home({
      products: state.products,
      pagination: state.pagination,
      isLoading: state.isLoading,
      categories: state.categories,
    }),
  );

  Search.mount();
  ProductCard.mount();

  store.watch(async (newValue) => {
    const url = new URL(window.location);
    Object.entries(newValue).forEach(([key, value]) => {
      if (value !== "" && value) {
        url.searchParams.set(key, value);
      }
    });
    navigate.push({}, url.toString());

    await fetchProducts(newValue);
    render.draw("main", Home({ products: state.products, pagination: state.pagination, isLoading: state.isLoading }));
    Search.mount();
    ProductCard.mount();
  }, "params");

  // const scrollTrigger = document.getElementById("scroll-trigger");
  // loadMoreProducts(scrollTrigger, loadMoreProductsCallback);
};

export default function Home({ products, pagination, isLoading, categories }) {
  return /* html */ `
    ${Search(categories, isLoading)}
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        <!-- 상품 그리드 -->
        ${state.isLoading ? Loading({ type: "products" }) : ProductList(products, pagination)}
        </div>
        <div id="scroll-trigger"  class="h-4"></div>
        </div>
        `;
}
