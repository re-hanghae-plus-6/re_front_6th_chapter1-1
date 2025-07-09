import { createRouter, setupRouter as registerRouter } from "./core/router";
import HomePage from "./page/HomePage";
import ProductDetailPage from "./page/ProductDetailPage";
import NotFoundPage from "./page/NotFoundPage";
import { getProduct } from "./api/productApi";
import { openCartModal, addToCartById, addToCart, updateCartBadge } from "./core/cart";

function createRouteRenderer() {
  let componentCleanup = null;

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
        // 이전 컴포넌트를 클린업 하기 위해 이전 컴포넌트의 cleanup 함수를 저장
        componentCleanup = component.cleanup;
      }
    } catch (err) {
      console.error("Component render error:", err);
    }
  }

  function cleanup() {
    console.log("[cleanup] 클린업 호출 called");
    console.log("componentCleanup", componentCleanup);
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
  let rootObserver = null;

  // 테스트 코드를 위한 옵저버 함수여서 추후 삭제 필요할듯..
  function observeRootContainer() {
    const targetNode = document.getElementById("root");
    if (!targetNode || rootObserver) return;

    rootObserver = new MutationObserver(() => {
      // 만약 외부에서 #root가 비워진 경우(예: 테스트 afterEach) 현재 라우트를 다시 렌더링
      if (targetNode.innerHTML === "" && router) {
        // 동일한 경로로 replace 네비게이션 → history 누적 방지
        router.navigate(window.location.pathname + window.location.search, { replace: true });
      }
    });

    rootObserver.observe(targetNode, { childList: true });
  }

  function disconnectRootObserver() {
    if (rootObserver) {
      rootObserver.disconnect();
      rootObserver = null;
    }
  }

  const globalClickHandler = (e) => {
    const cartBtn = e.target.closest("#cart-icon-btn");
    if (cartBtn) {
      e.preventDefault();
      openCartModal();
      return;
    }

    // 이벤트 객체에서 add-to-cart 버튼과 productId 추출
    const getAddBtnAndPid = (e) => {
      const addBtn = e.target.closest(".add-to-cart-btn");
      const pid = addBtn ? addBtn.getAttribute("data-product-id") : null;
      return { addBtn, pid };
    };

    // productCard에서 productData 생성
    const getProductData = (productCard) => {
      if (!productCard) return null;
      const title = productCard.querySelector("h3")?.textContent.trim() || "";
      const priceText = productCard.querySelector("p.text-lg")?.textContent.trim() || "0";
      const lprice = priceText.replace(/[^0-9]/g, "");
      const image = productCard.querySelector("img")?.getAttribute("src") || "";
      return {
        productId: productCard.querySelector(".add-to-cart-btn")?.getAttribute("data-product-id") || "",
        title,
        lprice,
        image,
        mallName: "",
        brand: "",
      };
    };

    // 메인 핸들러 함수
    const handleAddToCart = (e) => {
      e.preventDefault();
      const { addBtn, pid } = getAddBtnAndPid(e);
      if (!addBtn || !pid) return;

      const productCard = addBtn.closest(".product-card");
      const productData = getProductData(productCard);

      productCard ? addToCart(productData, 1) : addToCartById(pid, 1);
      updateCartBadge();
    };

    // 상품 목록의 장바구니 담기 버튼
    const addBtn = e.target.closest(".add-to-cart-btn");
    if (addBtn) {
      handleAddToCart(e);
      return;
    }

    // 이벤트에서 상세 장바구니 버튼과 productId 추출
    const getDetailBtnAndPid = (e) => {
      const detailBtn = e.target.closest("#add-to-cart-btn");
      const pid = detailBtn ? detailBtn.getAttribute("data-product-id") : null;
      return { detailBtn, pid };
    };

    // 수량 추출 함수
    const getQuantity = () => {
      const qtyInput = document.querySelector("#quantity-input");
      return qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
    };

    const handleDetailAddToCart = (e) => {
      const { detailBtn, pid } = getDetailBtnAndPid(e);
      if (!detailBtn) return;

      e.preventDefault();
      if (!pid) return;

      const qty = getQuantity();
      addToCartById(pid, qty);
      updateCartBadge();
    };

    // 상세 페이지 장바구니 담기 버튼
    const detailBtn = e.target.closest("#add-to-cart-btn");
    if (detailBtn) {
      handleDetailAddToCart(e);
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

      // 테스트 환경 등 외부에서 #root가 강제로 비워지는 상황을 대비하여 감시 설정
      // 테스트 코드를 위한 코드 인것 같아서 나중에 수정. afterEach 에서 초기화를 해줬는데도 테스트코드가 안돌아가는 상황..
      observeRootContainer();
      console.log("App initialized successfully");
    } catch (err) {
      console.error("App initialization failed:", err);
    }
  }

  function destroy() {
    removeGlobalEventListeners();
    disconnectRootObserver();
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
