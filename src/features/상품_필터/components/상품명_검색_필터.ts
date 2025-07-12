import { Component } from "../../../../componet";
import { searchParamsStore } from "../../common/search-params/search-params-store";
import { productStore } from "../../product/model/product-store";

export class 상품명_검색_필터 extends Component {
  unsubscribeList: Array<() => void> = [];

  render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "relative";

    const params = searchParamsStore.value;
    const search = params?.search || "";

    container.innerHTML = `
      <input
        type="text"
        id="search-input"
        placeholder="상품명을 검색해보세요..."
        value="${search}"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    `;

    const input = container.querySelector("#search-input");

    if (input instanceof HTMLInputElement) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const params = new URLSearchParams(window.location.search);
          params.set("search", input.value);
          params.set("page", "1"); // Reset to first page on new search
          productStore.setValue((prev) => ({
            ...prev,
            isLoading: true,
            data: [],
          }));
          const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
          window.history.replaceState({}, "", newUrl);
        }
      });
    }
    return container;
  }

  componentDidMount(): void {
    this.unsubscribeList.push(
      searchParamsStore.subscribe(() => {
        this.update();
      }),
    );
  }

  componentWillUnmount(): void {
    this.unsubscribeList.forEach((unsubscribe) => unsubscribe());
    this.unsubscribeList = [];
  }
}
