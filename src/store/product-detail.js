import { getProduct, getProducts } from "../api/productApi";
import { observable } from "../core/observer";
import { router } from "../core/router";

const defaultData = {
  isLoading: true,
  title: "",
  image: "",
  lprice: "",
  hprice: "",
  productId: "",
  category1: "",
  category2: "",
  description: "",
  rating: 0,
  reviewCount: 0,
  stock: 0,
  relatedProducts: [],
};

export const productDetailStore = observable({
  ...defaultData,

  initSearchParams() {
    productDetailStore.clear();
    const params = { ...router.getParams() };
    for (const [key, value] of Object.entries(params)) {
      productDetailStore[key] = value;
    }
  },
  clear() {
    for (const [key, value] of Object.entries(defaultData)) {
      productDetailStore[key] = value;
    }
  },
  async loadProduct() {
    const data = await getProduct(productDetailStore.productId);
    productDetailStore.title = data.title;
    productDetailStore.image = data.image;
    productDetailStore.lprice = data.lprice;
    productDetailStore.hprice = data.hprice;
    productDetailStore.productId = data.productId;
    productDetailStore.category1 = data.category1;
    productDetailStore.category2 = data.category2;
    productDetailStore.description = data.description;
    productDetailStore.rating = data.rating;
    productDetailStore.reviewCount = data.reviewCount;
    productDetailStore.stock = data.stock;
    productDetailStore.isLoading = false;
  },
  async loadRelatedProducts() {
    const defaultParams = {
      page: 1,
      limit: 20,
      search: "",
      sort: "price_asc",
    };
    const data = await getProducts({
      ...defaultParams,
      category1: productDetailStore.category1,
      category2: productDetailStore.category2,
    });
    productDetailStore.relatedProducts = data.products;
  },
});
