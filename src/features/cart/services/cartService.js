import { cartStore } from "../store/cartStore.js";

export const addToCart = (product, quantity = 1) => {
  const { items } = cartStore.getState();
  const productId = product.productId || product.id;
  const existingItem = items.find((item) => item.id === productId);

  let newItems;
  if (existingItem) {
    newItems = items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + quantity } : item));
  } else {
    const newItem = {
      id: productId,
      name: product.title,
      image: product.image,
      price: parseInt(product.lprice || 0),
      quantity: quantity,
    };
    newItems = [...items, newItem];
  }

  const itemCount = newItems.length;

  cartStore.setState({
    ...cartStore.getState(),
    items: newItems,
    itemCount: itemCount,
  });
};

export const removeFromCart = (productId) => {
  const { items, selectedItems } = cartStore.getState();
  const newItems = items.filter((item) => item.id !== productId);
  const newSelectedItems = selectedItems.filter((item) => item.id !== productId);
  const itemCount = newItems.length;

  cartStore.setState({
    ...cartStore.getState(),
    items: newItems,
    selectedItems: newSelectedItems,
    itemCount: itemCount,
  });
};

export const updateItemQuantity = (productId, quantity) => {
  const { items, selectedItems } = cartStore.getState();
  const newQuantity = Math.max(1, quantity);

  const newItems = items.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item));
  const newSelectedItems = selectedItems.map((item) =>
    item.id === productId ? { ...item, quantity: newQuantity } : item,
  );

  const itemCount = newItems.length;

  cartStore.setState({
    ...cartStore.getState(),
    items: newItems,
    selectedItems: newSelectedItems,
    itemCount: itemCount,
  });
};

export const toggleItemSelection = (productId, isSelected) => {
  const { items, selectedItems } = cartStore.getState();
  const item = items.find((item) => item.id === productId);

  if (!item) return;

  let newSelectedItems;
  if (isSelected) {
    newSelectedItems = [...selectedItems, item];
  } else {
    newSelectedItems = selectedItems.filter((item) => item.id !== productId);
  }

  cartStore.setState({
    ...cartStore.getState(),
    selectedItems: newSelectedItems,
  });
};

export const toggleAllSelection = (selectAll) => {
  const { items } = cartStore.getState();

  cartStore.setState({
    ...cartStore.getState(),
    selectedItems: selectAll ? [...items] : [],
  });
};

export const removeSelectedItems = () => {
  const { items, selectedItems } = cartStore.getState();
  const selectedIds = selectedItems.map((item) => item.id);
  const newItems = items.filter((item) => !selectedIds.includes(item.id));
  const itemCount = newItems.length;

  cartStore.setState({
    ...cartStore.getState(),
    items: newItems,
    selectedItems: [],
    itemCount: itemCount,
  });
};

export const clearCart = () => {
  cartStore.setState({
    ...cartStore.getState(),
    items: [],
    selectedItems: [],
    itemCount: 0,
  });
};

export const openCartModal = () => {
  cartStore.setState({
    ...cartStore.getState(),
    isModalOpen: true,
  });
};

export const closeCartModal = () => {
  cartStore.setState({
    ...cartStore.getState(),
    isModalOpen: false,
  });
};
