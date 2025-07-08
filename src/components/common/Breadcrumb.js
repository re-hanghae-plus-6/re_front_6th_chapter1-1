import ChevronRight from "../icon/ChevronRight";

export default function Breadcrumb({ segments = [] }) {
  const renderSegment = () => {
    return /* HTML */ `<a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
      ${ChevronRight()}`;
  };

  return /* HTML */ `<nav class="mb-4">
    <div class="flex items-center space-x-2 text-sm text-gray-600">
      <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
      ${segments.map(renderSegment).join("")}
    </div>
  </nav>`;
}
