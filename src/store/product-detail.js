import { getProduct } from "../api/productApi";
import { observable } from "../core/observer";
import { router } from "../core/router";

export const productDetailStore = observable({
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

  initSearchParams() {
    const params = { ...router.getParams() };
    for (const [key, value] of Object.entries(params)) {
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
});
