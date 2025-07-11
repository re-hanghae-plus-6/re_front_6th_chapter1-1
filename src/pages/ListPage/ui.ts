import { LoadingList, List } from "../../components/List";
import type { IListPageProps } from "./type";

/**
 * 순수 렌더링 함수: 상태를 받아서 HTML 문자열만 반환
 */
const ListPage = ({ products, total, loading }: IListPageProps): string => {
  return loading ? LoadingList : List({ products, total });
};

/**
 * DOM 업데이트 함수: 실제 DOM을 조작하고 컴포넌트 초기화
 */
const updateListPageUI = (state: IListPageProps): void => {
  const container = document.querySelector("#list-page-container");
  if (container) {
    // 1. HTML 업데이트
    container.innerHTML = ListPage(state);

    // 2. 로딩이 완료되면 컴포넌트 초기화 (추후 구현)
    if (!state.loading) {
      // TODO: initializeListSearchBox();
      console.log("Data loaded:", state.total, "products");
    }
  }
};

/**
 * 초기 ListPage 컨테이너 생성
 */
const createListPageContainer = (): string => {
  return `</>`;
};

export default ListPage;
export { updateListPageUI, createListPageContainer };
