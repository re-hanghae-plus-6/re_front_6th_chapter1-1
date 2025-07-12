import { state, pageState } from "../pages/productPage";
import { getProducts } from "../pages/productPage";
import { getQuery } from "../utils/queryFind";

export async function handleScroll() {
  if (state.isLoading || !pageState.hasNext) return;

  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.offsetHeight;
  const query = getQuery();
  if (windowHeight + scrollY >= documentHeight - 100) {
    console.log("다음 상품출력");

    const grid = document.querySelector("#products-grid");
    const spinner = document.createElement("div");
    spinner.id = "infinite-scroll-spinner";
    spinner.className = "col-span-2 text-center py-4";
    spinner.innerHTML = `
      <div class="inline-flex items-center">
        <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
             1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
      </div>
    `;
    grid?.appendChild(spinner);
    pageState.limit = query.limit;
    pageState.page += 1;
    await getProducts();

    document.getElementById("infinite-scroll-spinner")?.remove();
  }
}
