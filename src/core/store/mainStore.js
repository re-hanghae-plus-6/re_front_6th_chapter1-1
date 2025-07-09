import createStore from ".";

// TODO: 관심사별 store 분리 필요
const mainStore = createStore({
  isLoading: true,
  categoriesData: null,
  productsData: null,
});

export default mainStore;
