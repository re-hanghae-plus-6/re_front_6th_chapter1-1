import { ProductListLayoutLoaded } from "../components/ProductListLayoutLoaded.js";
import { CartWithSelection } from "../components/CartWithSelection.js";
import { CartEmpty } from "../components/CartEmpty.js";

const HomePage = async (params, state) => {
  return /* HTML */ `
    ${ProductListLayoutLoaded({
      products: state.products || [],
      isLoading: state.isLoading || false,
      isLoadingMore: state.isLoadingMore || false,
      selectedCategory1: state.selectedCategory1 || "",
      selectedCategory2: state.selectedCategory2 || "",
      categories: state.categories || {},
      limit: state.limit || 20,
      cartItems: state.cartItems || [],
    })}

    <!-- Cart Modal -->
    ${state.isCartModalOpen
      ? /* HTML */ `
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 sm:items-center sm:p-4">
            ${state.cartItems && state.cartItems.length > 0
              ? CartWithSelection({ items: state.cartItems })
              : CartEmpty()}
          </div>
        `
      : ""}
  `;
};

export default HomePage;
