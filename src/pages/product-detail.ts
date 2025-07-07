import type { PageModule } from "../router.ts";
import { getProduct, getProducts } from "../api/productApi.js";
import { 상품상세_레이아웃 } from "../components/product-detail/index.ts";
import { navigate } from "../router.ts";
import { 토스트 } from "../components/toast/index.ts";

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
    return 상품상세_레이아웃({ loading: true });
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

        const CART_KEY = "cart_items";
        const existing = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
        const idx = existing.findIndex((it: any) => it.id === state.product!.productId);
        if (idx > -1) existing[idx].qty += qty;
        else existing.push({ id: state.product!.productId, qty });
        localStorage.setItem(CART_KEY, JSON.stringify(existing));

        토스트("장바구니에 추가되었습니다", "success");
      };

      const handleRelatedClick = (e: Event) => {
        const pid = (e.currentTarget as HTMLElement).dataset.productId;
        if (pid) navigate(`/product/${pid}`);
      };

      if (decButtonEl) decButtonEl.addEventListener("click", handleDecrease);
      if (incButtonEl) incButtonEl.addEventListener("click", handleIncrease);
      if (addButtonEl) addButtonEl.addEventListener("click", handleAddToCart);
      relatedProductEls.forEach((el) => el.addEventListener("click", handleRelatedClick));
    };

    initData();
  },
};

export default detailPage;
