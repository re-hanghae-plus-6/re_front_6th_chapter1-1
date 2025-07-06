export const Breadcrumb = ({ items = [{ label: "홈", href: "/", isLink: true }] } = {}) => `
  <nav class="mb-4">
    <div class="flex items-center space-x-2 text-sm text-gray-600">
      ${items
        .map(
          (item, index) => `
        ${
          index > 0
            ? `
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        `
            : ""
        }
        ${
          item.isLink
            ? `
          <a href="${item.href}" data-link="" class="hover:text-blue-600 transition-colors">${item.label}</a>
        `
            : `
          <button class="breadcrumb-link ${item.category1 ? `data-category1="${item.category1}"` : ""} ${item.category2 ? `data-category2="${item.category2}"` : ""}">${item.label}</button>
        `
        }
      `,
        )
        .join("")}
    </div>
  </nav>
`;
