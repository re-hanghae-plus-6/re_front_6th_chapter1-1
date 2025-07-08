import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "./constants";
import { Router } from "./lib/Router";
import { createStore } from "./lib/Store";
import { routes } from "./routes";

const initialState = {
  data: {
    categories: [],
    products: [],
  },
  filter: {
    isLoading: false,
  },
  product: {
    isLoading: false,
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sort: DEFAULT_SORT,
  },
  cart: {
    items: [],
    selectedItems: [],
    totalPrice: 0,
    selectedPrice: 0,
  },
};

export default function App() {
  const globalStore = createStore(initialState);
  console.log("globalstore: ", globalStore);

  new Router(routes, document.getElementById("root"));
}
