import { createRouter, setupRouter as registerRouter } from "./core/router";
import HomePage from "./page/HomePage";
import ProductDetailPage from "./page/ProductDetailPage";
import NotFoundPage from "./page/NotFoundPage";
import { getProduct } from "./api/productApi";
import { openCartModal, addToCartById, updateCartBadge } from "./core/cart";

function createRouteRenderer() {
  let componentCleanup = null;

  function attachComponentEventListeners() {
    // 내부 처리 필요 시 확장
  }

  async function render(routeData) {
    if (!routeData || !routeData.route || !routeData.route.component) return;

    const { route, params, data } = routeData;

    try {
      cleanup();
      const component = route.component({ ...params, ...data });
      const $root = document.getElementById("root");
      if (!$root) return;
      if (component && typeof component === "object" && component.html) {
        $root.innerHTML = component.html;

        // 지금 생성된 새로운 컴포넌트가 아닌 이전 컴포넌트의 cleanup 함수를 사용
        componentCleanup = component.cleanup;
        attachComponentEventListeners();
      }
    } catch (err) {
      console.error("Component render error:", err);
      renderError(err);
    }
  }

  function renderError(error) {
    const $root = document.getElementById("root");
    if ($root) {
      $root.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
          <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
              <p class="text-gray-600 mb-6">${error.message}</p>
              <button onclick="window.location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">페이지 새로고침</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  function cleanup() {
    componentCleanup?.();
    componentCleanup = null;
  }

  function destroy() {
    cleanup();
  }

  return { render, destroy };
}

function createApplication() {
  let router = null;
  let renderer = null;
  let routerUnsubscribe = null;

  const globalClickHandler = (e) => {
    const cartBtn = e.target.closest("#cart-icon-btn");
    if (cartBtn) {
      e.preventDefault();
      openCartModal();
      return;
    }

    // 상품 목록의 장바구니 담기 버튼
    const addBtn = e.target.closest(".add-to-cart-btn");
    if (addBtn) {
      e.preventDefault();
      const pid = addBtn.getAttribute("data-product-id");
      if (pid) {
        addToCartById(pid, 1);
        updateCartBadge();
      }
      return;
    }

    // 상세 페이지 장바구니 담기 버튼
    const detailBtn = e.target.closest("#add-to-cart-btn");
    if (detailBtn) {
      e.preventDefault();
      const pid = detailBtn.getAttribute("data-product-id");
      let qty = 1;
      const qtyInput = document.querySelector("#quantity-input");
      if (qtyInput) qty = parseInt(qtyInput.value) || 1;
      if (pid) {
        addToCartById(pid, qty);
        updateCartBadge();
      }
      return;
    }

    const link = e.target.closest("[data-link]");
    if (link) {
      e.preventDefault();
      window.navigateTo(link.getAttribute("href"));
    }
  };

  function setupGlobalEventListeners() {
    document.addEventListener("click", globalClickHandler);
  }
  function removeGlobalEventListeners() {
    document.removeEventListener("click", globalClickHandler);
  }

  function configureRouter() {
    const routes = [
      { path: "/", component: () => HomePage({ cartCount: 0 }) },
      {
        path: "/product/:id",
        component: ({ product }) => ProductDetailPage({ product, cartCount: 0 }),
        loader: async ({ id }) => {
          try {
            const product = await getProduct(id);
            return { product };
          } catch (err) {
            console.error("Failed to load product detail:", err);
            throw err;
          }
        },
      },
      { path: "/404", component: NotFoundPage },
    ];

    router = createRouter();
    router.addRoutes(routes);
    registerRouter(router);

    routerUnsubscribe = router.subscribe(async (routeData) => {
      await renderer.render(routeData);
    });
  }

  async function init() {
    try {
      renderer = createRouteRenderer();
      setupGlobalEventListeners();
      configureRouter();
      await router.init();
      console.log("App initialized successfully");
    } catch (err) {
      console.error("App initialization failed:", err);
    }
  }

  function destroy() {
    removeGlobalEventListeners();
    if (routerUnsubscribe) {
      routerUnsubscribe();
      routerUnsubscribe = null;
    }
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
    router = null; // cleanupRouter는 core/router 내부에서 처리
  }

  return { init, destroy };
}

// 싱글톤 인스턴트
let appInstance = null;

export default function App() {
  if (!appInstance) {
    appInstance = createApplication();
    appInstance.init();
  }
  return appInstance;
}

export function destroyApp() {
  if (appInstance) {
    appInstance.destroy();
    appInstance = null;
  }
}

// 페이지 언로드 시 자동 정리
window.addEventListener("beforeunload", () => {
  destroyApp();
});
