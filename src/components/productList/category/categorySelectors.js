import { CategoryButton } from "./categoryButton.js";

export const categorySelectors = ({ category1, category2, categories }) => {
  let selectCategory = [];
  let selectCategoryName = "";

  if (category2 || category1) {
    selectCategory = Object.keys(categories[category1]);

    if (category2) {
      selectCategoryName = category2;
    }
  } else {
    selectCategory = Object.keys(categories);
  }

  console.log("selectCategory", selectCategory);
  console.log("selectCategoryName", selectCategoryName);
  return `
    <div class="flex flex-wrap gap-2">
    ${selectCategory
      .map((category) => {
        return CategoryButton({
          category1: category1,
          category2: category2,
          name: category,
          isSelected: category === selectCategoryName,
        });
      })
      .join("")}
    </div>
    `;
};
