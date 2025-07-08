import { CartProductItem } from "./CartProductItem";

export const CartProductSection = () => {
  return /* HTML */ `<div class="flex-1 overflow-y-auto">
    <div class="p-4 space-y-4">${CartProductItem()}</div>
  </div>`;
};
