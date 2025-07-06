export default function Breadcrumb({ items = [{ label: "홈", href: "/", isLink: true }] }) {
  return /* HTML */ `
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        ${items
          .map((item, index) => {
            const isLast = index === items.length - 1;
            let content = "";
            if (item.isLink) {
              content = /*html*/ `<a href="${item.href}" data-link="" class="hover:text-blue-600 transition-colors">${item.label}</a>`;
            } else if (item.onClick) {
              content = /*html*/ `<button class="breadcrumb-link" ${
                item.data
                  ? Object.entries(item.data)
                      .map(([key, value]) => `data-${key}="${value}"`)
                      .join(" ")
                  : ""
              }>${item.label}</button>`;
            } else {
              content = /*html*/ `<span class="text-xs text-gray-600 cursor-default">${item.label}</span>`;
            }

            const separator = !isLast
              ? /*html*/ `
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          `
              : "";

            return content + separator;
          })
          .join("")}
      </div>
    </nav>
  `;
}
