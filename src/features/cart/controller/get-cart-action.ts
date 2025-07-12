import { handleToastMessage } from "../../common/controller/handle-toast-message";
import { productStore } from "../../product/model/product-store";
import { cartStore } from "../model/cartStore";

/**
 * getCartAction
 **/
export function getCartAction() {
  return {
    addToCart: (productId: string) => {
      const product = productStore.value.data.flatMap((v) => v.products).find((p) => p.productId === productId);
      if (!product) return;

      cartStore.setValue((prev) => ({
        ...prev,
        productList: [...prev.productList, product],
      }));

      handleToastMessage({
        text: "장바구니에 추가되었습니다",
        type: "success",
      });
    },
    changeQuantity: (productId: string, diff: number) => {
      cartStore.setValue((prev) => {
        const count = prev.productList.filter((p) => p.productId === productId).length;
        if (count + diff < 1) return prev;
        let newList = [...prev.productList];
        if (diff > 0) {
          // 수량 증가: product 추가
          const product = prev.productList.find((p) => p.productId === productId);
          if (product) newList.push(product);
        } else {
          // 수량 감소: product 하나 제거
          let removed = false;
          newList = newList.filter((p) => {
            if (!removed && p.productId === productId) {
              removed = true;
              return false;
            }
            return true;
          });
        }
        return { ...prev, productList: newList };
      });
    },
    deleteItem: (productId: string) => {
      cartStore.setValue((prev) => ({
        ...prev,
        productList: prev.productList.filter((p) => p.productId !== productId),
        selectedProductIds: prev.selectedProductIds.filter((id) => id !== productId),
      }));
    },
    toggleSelect: (productId: string, checked: boolean) => {
      cartStore.setValue((prev) => {
        const ids = new Set(prev.selectedProductIds);
        if (checked) ids.add(productId);
        else ids.delete(productId);
        return { ...prev, selectedProductIds: Array.from(ids) };
      });
    },
    toggleSelectAll: () => {
      cartStore.setValue((prev) => {
        const allIds = Array.from(new Set(prev.productList.map((p) => p.productId)));
        const allSelected = allIds.every((id) => prev.selectedProductIds.includes(id));
        return {
          ...prev,
          selectedProductIds: allSelected ? [] : allIds,
        };
      });
    },
    deleteSelected: () => {
      cartStore.setValue((prev) => {
        const ids = new Set(prev.selectedProductIds);
        return {
          ...prev,
          productList: prev.productList.filter((p) => !ids.has(p.productId)),
          selectedProductIds: [],
        };
      });
    },
    clearCart: () => {
      cartStore.setValue((prev) => ({ ...prev, productList: [], selectedProductIds: [] }));
    },
    getQuantity: (productId: string) => {
      return cartStore.value.productList.filter((p) => p.productId === productId).length;
    },
    isSelected: (productId: string) => {
      return cartStore.value.selectedProductIds.includes(productId);
    },
  };
}
