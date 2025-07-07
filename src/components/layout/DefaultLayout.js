import footer from './footer/Footer.js';
import header from './header/Header.js';

function DefaultLayout({ children }) {
  return `
    <div class="min-h-screen bg-gray-50">
      ${header()}
      ${children}
      ${footer()}
    </div>
  `;
}

export default DefaultLayout;
