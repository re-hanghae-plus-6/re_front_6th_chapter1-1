import SearchInput from "./SearchInput.js";
import Category from "./Category.js";
import SortFilter from "./SortFilter.js";
import LimitFilter from "./LimitFilter.js";

export default function FilterSection({
  searchValue = "",
  categories = [],
  selectedCategory1 = "",
  selectedCategory2 = "",
  selectedSort = "price_asc",
  selectedLimit = "20",
  isLoading = false,
}) {
  return /* HTML */ `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      ${SearchInput({ value: searchValue })}
      <div class="space-y-3">
        ${Category({
          categories,
          selectedCategory1,
          selectedCategory2,
          isLoading,
        })}

        <div class="flex gap-2 items-center justify-between">
          ${LimitFilter({ selectedLimit })} ${SortFilter({ selectedSort })}
        </div>
      </div>
    </div>
  `;
}
