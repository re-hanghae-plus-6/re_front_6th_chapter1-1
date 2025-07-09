import { CART_ACTIONS } from "../actions/cartActions.js";

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { productId, quantity } = action.payload;

      const product = state.products.find((product) => product.productId === productId);
      if (!product) {
        console.warn(`productId가 products에 없습니다: ${productId}`);
        return state;
      }

      const existingItemIndex = state.cart.items.findIndex((item) => item.productId === productId);

      if (existingItemIndex >= 0) {
        const newItems = [...state.cart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };

        return {
          ...state,
          cart: {
            ...state.cart,
            items: newItems,
          },
        };
      } else {
        const newItem = {
          productId,
          quantity,
          selected: false,
          product,
        };
        return {
          ...state,
          cart: {
            ...state.cart,
            items: [...state.cart.items, newItem],
          },
        };
      }
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const { productId } = action.payload;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.productId !== productId),
        },
      };
    }

    case CART_ACTIONS.UPDATE_CART_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: {
            ...state.cart,
            items: state.cart.items.filter((item) => item.productId !== productId),
          },
        };
      }

      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        },
      };
    }

    case CART_ACTIONS.TOGGLE_CART_ITEM_SELECTION: {
      const { productId } = action.payload;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.productId === productId ? { ...item, selected: !item.selected } : item,
          ),
        },
      };
    }

    case CART_ACTIONS.TOGGLE_ALL_CART_ITEMS: {
      const { selected } = action.payload;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) => ({
            ...item,
            selected,
          })),
        },
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
        },
      };

    case CART_ACTIONS.REMOVE_SELECTED_ITEMS:
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => !item.selected),
        },
      };

    case CART_ACTIONS.SHOW_CART_MODAL:
      return {
        ...state,
        cart: {
          ...state.cart,
          isModalOpen: true,
        },
      };

    case CART_ACTIONS.HIDE_CART_MODAL:
      return {
        ...state,
        cart: {
          ...state.cart,
          isModalOpen: false,
        },
      };

    case CART_ACTIONS.TOGGLE_CART_MODAL:
      return {
        ...state,
        cart: {
          ...state.cart,
          isModalOpen: !state.cart.isModalOpen,
        },
      };

    default:
      return state;
  }
}
