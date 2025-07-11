import { getProduct, getProducts } from "../../api/productApi.js";
import { Footer } from "../../components/layout/Footer.js";
import { Header } from "../../components/layout/Header.js";
import { Toast } from "../../components/layout/Toast.js";
import { updateCurrent } from "../../core/renderer.js";
import { Cart } from "../../features/cart/Cart.js";
import { ProductDetailLoader } from "../../features/products/ProductDetailLoader.js";
import { createState, getRouteParams } from "../../utils/store.js";
import { NavSection } from "./components/NavSection.js";
import { ProductInfoSection } from "./components/ProductInfoSection.js";
import { RelatedSection } from "./components/RelatedSection.js";

const DETAIL = "DETAIL";

export const [getDetailState, setDetailState] = createState(DETAIL, {
  product: null,
  relatedProducts: [],
  isLoading: true,
  isRelatedLoading: true,
  quantity: 1,
});

export const ProductDetailPage = () => {
  const { isLoading, isRelatedLoading } = getDetailState();

  if (isLoading) {
    return "";
  }

  return /* HTML */ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ isBackButton: true, title: "상품 상세" })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${NavSection()} ${ProductInfoSection()} ${isRelatedLoading ? ProductDetailLoader() : RelatedSection()}
        ${Footer()} ${Toast()} ${Cart()}
      </main>
    </div>
  `;
};

ProductDetailPage.onMount = async () => {
  const params = getRouteParams();
  const productId = params.id;
  const product = await getProduct(productId);

  setDetailState((prev) => ({
    ...prev,
    product: product,
    isLoading: false,
    isRelatedLoading: true,
  }));

  updateCurrent();

  const relatedProducts = await getProducts({ category2: product.category2 });

  setDetailState((prev) => ({
    ...prev,
    relatedProducts: relatedProducts.products.filter((relatedProduct) => relatedProduct.productId !== productId),
    isRelatedLoading: false,
  }));

  updateCurrent();
};

ProductDetailPage.onUnmount = () => {
  setDetailState({
    product: null,
    relatedProducts: [],
    isLoading: true,
    quantity: 1,
  });
};
