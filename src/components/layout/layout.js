import { createHeader } from "./header.js";
import { createFooter } from "./footer.js";

/**
 * 전체 레이아웃 컴포넌트
 * @param {string} content - 메인 콘텐츠 HTML
 * @param {Object} options - 레이아웃 옵션
 * @returns {string} 전체 레이아웃 HTML
 */
export function createLayout(content, options = {}) {
  const { cartCount = 0 } = options;

  return `
    <div class="min-h-screen bg-gray-50">
      ${createHeader({ cartCount })}
      ${content}
      ${createFooter()}
    </div>
  `;
}
