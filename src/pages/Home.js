import { Header } from "../components/Layout/Header";
import { FilterSection } from "../components/FilterSection/FilterSection";
import { ProductSection } from "../components/ProductSection/ProductSection";
import { Footer } from "../components/Layout/Footer";

export function Home(state) {
  const { isLoading, products, total } = state;

  return /* HTML */ `
    <div class="bg-gray-50">
      ${Header({ type: "home" })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${FilterSection({
          keyword: "",
          categories: {},
          category1: "",
          category2: "",
          isLoading: false,
          count: 20,
          sort: "price_asc",
        })}
        ${ProductSection({ isLoading, products, total })}
      </main>
      ${Footer()}
    </div>
  `;
}
