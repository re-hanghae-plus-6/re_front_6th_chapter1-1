import { ProjectDetail } from "./ProjectDetail";
import { getProduct, getProducts } from "../api/productApi";
import { _404_ } from "./NotFoundPage";

let projectDetailState = {
  loading: false,
  projectDetail: {},
  otherProducts: [],
  count: 1,
};

export const ProjectDetailPage = async () => {
  const [, _link, id] = location.pathname.split("/");
  console.log(_link);

  if (!id) {
    return _404_();
  } else {
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
  }
};

function onPlusClick() {
  projectDetailState.count += 1;
  // UI만 부분 업데이트
  document.body.querySelector("#root").innerHTML = ProjectDetail(projectDetailState);
}

function onMiusClick() {
  projectDetailState.count -= 1;
  // UI만 부분 업데이트
  document.body.querySelector("#root").innerHTML = ProjectDetail(projectDetailState);
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#quantity-increase")) {
    onPlusClick(e);
  }

  if (e.target.closest("#quantity-decrease")) {
    onMiusClick(e);
  }
});

const root = document.querySelector("#root");
root.addEventListener("click", (e) => {
  // svg나 img 위 클릭도 카드까지 추적
  const card = e.target.closest(".related-product-card");
  if (!card) return;

  e.preventDefault();
  const projectId = card.dataset.productId;
  history.pushState({}, "", `/product/${projectId}`);
  // PopStateEvent로 날려야 라우터 popstate 핸들러 탄다
  window.dispatchEvent(new PopStateEvent("popstate"));
});
