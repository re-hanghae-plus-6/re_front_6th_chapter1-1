import type { PageModule } from "../router.ts";
import { getProduct, getProducts } from "../api/productApi.js";
import { 상품상세_레이아웃 } from "../components/product-detail/index.ts";
import { navigate } from "../router.ts";
import { 토스트 } from "../components/toast/index.ts";
import { 장바구니 } from "../components/cart/index.ts";
import { addToCart, getCartCount } from "../utils/cart.ts";

interface Product {
  productId: string;
  title: string;
  lprice: string;
  image: string;
  description?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
}

interface State {
  loading: boolean;
  product: Product | null;
  relatedProducts: { id: string; title: string; price: number; imageUrl: string }[];
  qty: number;
}

export const detailPage: PageModule = {
  render() {
    return 상품상세_레이아웃({ loading: true, cartCount: getCartCount() });
  },

  mount(root) {
    if (!root) return;

    let state: State = {
      loading: true,
      product: null,
      relatedProducts: [],
      qty: 1,
    };

    const setState = (newState: Partial<State>) => {
      state = { ...state, ...newState };
      rerender();
    };

    const rerender = () => {
      root.innerHTML = 상품상세_레이아웃({
        loading: state.loading,
        product: state.product ?? undefined,
        relatedProducts: state.relatedProducts,
        qty: state.qty,
        cartCount: getCartCount(),
      });

      if (!state.loading) bindEvents();
    };

    const initData = async () => {
      try {
        const productId = location.pathname.split("/").pop() ?? "";
        const product = await getProduct(productId);
        setState({ product, loading: false });

        const list = await getProducts({ limit: 20 });
        const relatedProducts = (list.products as Product[])
          .filter((p) => p.productId !== productId)
          .slice(0, 19)
          .map((p) => ({
            id: p.productId,
            title: p.title,
            price: Number(p.lprice),
            imageUrl: p.image,
          }));

        setState({ relatedProducts });
      } catch (err) {
        console.error(err);
        root.textContent = "상품을 불러오는데 실패했습니다.";
      }
    };

    const bindEvents = () => {
      const decButtonEl = root.querySelector("#quantity-decrease") as HTMLButtonElement | null;
      const inputEl = root.querySelector("#quantity-input") as HTMLInputElement | null;
      const incButtonEl = root.querySelector("#quantity-increase") as HTMLButtonElement | null;
      const addButtonEl = root.querySelector("#add-to-cart-btn") as HTMLButtonElement | null;
      const relatedProductEls = root.querySelectorAll(".related-product-card");
      const cartIconEl = root.querySelector("#cart-icon-btn") as HTMLButtonElement | null;

      const handleDecrease = () => {
        if (!inputEl) return;
        const current = Math.max(1, parseInt(inputEl.value || "1", 10) - 1);
        inputEl.value = String(current);
      };

      const handleIncrease = () => {
        if (!inputEl) return;
        const current = Math.max(1, parseInt(inputEl.value || "1", 10) + 1);
        inputEl.value = String(current);
      };

      const handleAddToCart = () => {
        if (!inputEl || !state.product) return;
        const qty = Math.max(1, parseInt(inputEl.value || "1", 10));
        const unitPrice = Number(state.product.lprice ?? 0);
        addToCart(state.product.productId, qty, unitPrice, state.product.title);
        토스트("장바구니에 추가되었습니다", "success");
        rerender();
      };

      const handleRelatedClick = (e: Event) => {
        const pid = (e.currentTarget as HTMLElement).dataset.productId;
        if (pid) navigate(`/product/${pid}`);
      };

      if (decButtonEl) decButtonEl.addEventListener("click", handleDecrease);
      if (incButtonEl) incButtonEl.addEventListener("click", handleIncrease);
      if (addButtonEl) addButtonEl.addEventListener("click", handleAddToCart);
      relatedProductEls.forEach((el) => el.addEventListener("click", handleRelatedClick));
      if (cartIconEl) cartIconEl.addEventListener("click", 장바구니);
    };

    initData();
  },
};

export default detailPage;
