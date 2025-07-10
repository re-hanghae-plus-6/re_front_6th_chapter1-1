import { ArrowRightIcon } from "../icons/ArrowRightIcon";

export function Breadcrumb(props) {
  const { category1, category2, category3, category4 } = props;
  const categories = [category1, category2, category3, category4];

  const categoryHtml = categories
    .filter((category) => category && category.trim() !== "")
    .map(
      (category, index) => /* HTML */ `
        ${ArrowRightIcon()}
        <button class="breadcrumb-link" data-category${index + 1}="${category}">${category}</button>
      `,
    )
    .join("");

  return /* HTML */ `
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
        ${categoryHtml}
      </div>
    </nav>
  `;
}
