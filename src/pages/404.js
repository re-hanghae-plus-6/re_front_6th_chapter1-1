import { cart } from './Cart.js';

export class NotFound {
  constructor() {
    this.setupEventListeners = this.setupEventListeners.bind(this);
  }

  generateHtml() {
    return `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-40">
          <div class="max-w-md mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <h1 class="text-lg font-bold text-gray-900">404 - 페이지를 찾을 수 없습니다</h1>
              </div>
              <div class="flex items-center space-x-2">
                <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main class="max-w-md mx-auto px-4 py-4">
          <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
            <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4">
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
                </linearGradient>
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
                </filter>
              </defs>
              
              <!-- 404 Numbers -->
              <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
              
              <!-- Icon decoration -->
              <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
              <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
              <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
              <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
              
              <!-- Message -->
              <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
              
              <!-- Subtle bottom accent -->
              <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
            </svg>
            
            <button id="home-btn" class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</button>
          </div>
        </main>
        <footer class="bg-white shadow-sm mt-8">
          <div class="max-w-md mx-auto py-8 text-center text-gray-500">
            <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
          </div>
        </footer>
      </div>
    `;
  }

  setupEventListeners() {
    const homeBtn = document.querySelector('#home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
      });
    }

    const cartIconBtn = document.querySelector('#cart-icon-btn');
    if (cartIconBtn) {
      cartIconBtn.addEventListener('click', () => {
        cart.openModal();
      });
    }
  }

  async render() {
    const html = this.generateHtml();
    document.querySelector('#root').innerHTML = html;
    this.setupEventListeners();
    cart.updateCartIcon();
  }
}
