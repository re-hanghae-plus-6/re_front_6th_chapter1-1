import { getCartState, updateCartState } from "../store/cartStore.js";

export const addToCart = (product, quantity = 1) => {
  const { items } = getCartState();

  const existingItem = items.find((item) => item.id === (product.productId || product.id));

  let newItems;
  if (existingItem) {
    newItems = items.map((item) =>
      item.id === (product.productId || product.id) ? { ...item, quantity: item.quantity + quantity } : item,
    );
  } else {
    const newItem = {
      id: product.productId || product.id,
      name: product.title,
      image: product.image,
      price: parseInt(product.lprice || 0),
      quantity: quantity,
    };
    newItems = [...items, newItem];
  }

  const totalCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

  updateCartState({
    items: newItems,
    totalCount: totalCount,
  });
};

export const openCartModal = () => {
  updateCartState({ isModalOpen: true });
};

export const closeCartModal = () => {
  updateCartState({
    isModalOpen: false,
    selectedItems: [],
  });
};
