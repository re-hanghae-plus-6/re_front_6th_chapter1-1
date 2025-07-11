import { LoadingList, List } from "../../components/List";
import type { IListPageProps } from "./type";
import type { ListPageController } from "./controller";

/**
 * 순수 렌더링 함수: 상태를 받아서 HTML 문자열만 반환
 */
const ListPage = ({ products, total, loading, limit }: IListPageProps): string => {
  return loading ? LoadingList(limit) : List({ products, total });
};

/**
 * DOM 업데이트 함수: 실제 DOM을 조작하고 컴포넌트 초기화
 */
const updateListPageUI = (state: IListPageProps, controller?: ListPageController): void => {
  const container = document.querySelector("#list-page-container");
  if (container) {
    // 1. HTML 업데이트
    container.innerHTML = ListPage(state);

    // 2. 로딩이 완료되면 컴포넌트 초기화
    if (!state.loading && controller) {
      initializeListSearchBox(controller);
      console.log("Data loaded:", state.total, "products");
    }
  }
};

/**
 * ListSearchBox 이벤트 리스너 초기화
 */
const initializeListSearchBox = (controller: ListPageController): void => {
  const limitSelect = document.querySelector("#limit-select") as HTMLSelectElement;

  if (limitSelect) {
    // 현재 limit 값으로 select 값 설정
    limitSelect.value = controller.getLimit().toString();

    // limit 변경 이벤트 리스너 등록
    limitSelect.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      const newLimit = parseInt(target.value, 10);

      if (!isNaN(newLimit)) {
        controller.setLimit(newLimit, (updatedState) => {
          updateListPageUI(updatedState, controller);
        });
      }
    });
  }
};

/**
 * 초기 ListPage 컨테이너 생성
 */
const createListPageContainer = (): string => {
  return `<div id="list-page-container"></div>`;
};

export default ListPage;
export { updateListPageUI, createListPageContainer };
