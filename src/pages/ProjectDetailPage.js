import { ProjectDetail } from "./ProjectDetail";
import { getProduct, getProducts } from "../api/productApi";
import { _404_ } from "./NotFoundPage";

let projectDetailState = {
  loading: false,
  projectDetail: {},
  otherProducts: [],
};

export const ProjectDetailPage = async () => {
  const [, _link, id] = location.pathname.split("/");
  console.log(_link);

  if (!id) {
    return _404_();
  } else {
    await fetchProjectDetailData(id);
  }
};

export const fetchProjectDetailData = async (id) => {
  projectDetailState.loading = true;

  document.body.querySelector("#root").innerHTML = ProjectDetail(projectDetailState);

  const projectData = await getProduct(id);

  const category = projectData.category1;
  const products = await getProducts({ category1: category });
  const otherProducts = products.products.filter(({ productId }) => productId !== id);

  projectDetailState.loading = false;
  projectDetailState.projectDetail = projectData;
  projectDetailState.otherProducts = otherProducts;
  document.body.querySelector("#root").innerHTML = ProjectDetail(projectDetailState);
};

const handleClick = (e) => {
  const projectId = e.dataset.productId;

  history.pushState(null, "", `/product/${projectId}`);
  window.dispatchEvent(new Event("popstate"));
};

document.addEventListener("click", (e) => {
  if (e.target.closest(".related-product-card")) {
    e.preventDefault();
    handleClick(e.target.closest(".related-product-card"));
  }
});
