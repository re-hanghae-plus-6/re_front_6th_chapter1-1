import Category from "./Category";
import PerPageCountSelect from "./PerPageCountSelect";
import SearchBar from "./SearchBar";
import SortSelect from "./SortSelect";

function FilterSection({
  loading = false,
  categories = {},
  selectedCategory1,
  selectedCategory2,
  onCategorySelect,
  onBreadcrumbClick,
}) {
  return /* HTML */ `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      ${SearchBar()}
      <div class="space-y-3">
        ${Category({
          loading,
          categories,
          selectedCategory1,
          selectedCategory2,
          onCategorySelect,
          onBreadcrumbClick,
        })}
        <div class="flex gap-2 items-center justify-between">${PerPageCountSelect()} ${SortSelect()}</div>
      </div>
    </div>
  `;
}

export default FilterSection;
