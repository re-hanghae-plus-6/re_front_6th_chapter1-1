import { Header } from './Header.js';
import { Footer } from './Footer.js';

export function Layout({ title = '쇼핑몰', showBackButton = false, content }) {
  // 기존 호환성을 위해 content가 문자열인 경우 처리
  if (typeof arguments[0] === 'string') {
    content = arguments[0];
    title = '쇼핑몰';
    showBackButton = false;
  }

  return `
    <div class="min-h-screen bg-gray-50">
      ${Header({ title, showBackButton })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${content}
      </main>
      ${Footer()}
    </div>
  `;
}
