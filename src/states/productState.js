export let productListState = {
  products: [],
  categories: {},
  total: 0,
  isLoading: false,
  isCategoryLoading: false,
  search: "",
  category1: "",
  category2: "",
  limit: "20",
  sort: "price_asc",
  page: 1,
  hasNext: true,
};

export let productDetailState = {
  isLoading: false,
  product: {},
  category1: "",
  category2: "",
  relatedProducts: [],
};
