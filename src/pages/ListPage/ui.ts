import { LoadingList, List } from "../../components/List";
import type { IListPageProps } from "./type";
import type { ListPageController } from "./controller";

/**
 * 순수 렌더링 함수: 상태를 받아서 HTML 문자열만 반환
 */
const ListPage = ({ products, total, loading, limit, search, sort, loadingMore }: IListPageProps): string => {
  return loading ? LoadingList(limit, search, sort) : List({ products, total, search, sort, loadingMore });
};

/**
 * ListPage UI 업데이트 함수
 */
const updateListPageUI = (state: IListPageProps, controller: ListPageController): void => {
  const listPageContainer = document.getElementById("list-page-container");

  if (listPageContainer) {
    // hasMore 상태 추가
    const hasMore = controller.getHasMore();
    const loadingMore = controller.getLoadingMore();

    listPageContainer.innerHTML = state.loading
      ? LoadingList(state.limit, state.search, state.sort)
      : List({
          products: state.products,
          total: state.total,
          search: state.search,
          sort: state.sort,
          loadingMore,
          hasMore,
        });

    // 초기 로딩이 완료된 후에만 이벤트 리스너 초기화
    if (!state.loading) {
      initializeListSearchBox(controller);
      initializeInfiniteScroll(controller);
    }
  }
};

/**
 * 무한 스크롤 이벤트 리스너 초기화
 */
const initializeInfiniteScroll = (controller: ListPageController): void => {
  // 기존 스크롤 이벤트 리스너 제거 (중복 방지)
  const existingScrollListener = document.body.getAttribute("data-scroll-listener");
  if (existingScrollListener) {
    return;
  }

  document.body.setAttribute("data-scroll-listener", "true");

  const scrollHandler = () => {
    // 페이지 하단 근처에 도달했는지 확인
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 하단 100px 근처에 도달했을 때 트리거
    if (scrollTop + windowHeight >= documentHeight - 100) {
      if (controller.getHasMore() && !controller.getLoadingMore()) {
        controller.loadMoreData((updatedState) => {
          updateListPageUI(updatedState, controller);
        });
      }
    }
  };

  window.addEventListener("scroll", scrollHandler);

  // 페이지 이동 시 이벤트 리스너 정리
  const originalPushState = history.pushState;
  history.pushState = function () {
    document.body.removeAttribute("data-scroll-listener");
    window.removeEventListener("scroll", scrollHandler);
    originalPushState.apply(history, arguments);
  };
};

/**
 * ListSearchBox 이벤트 리스너 초기화
 */
const initializeListSearchBox = (controller: ListPageController): void => {
  const limitSelect = document.querySelector("#limit-select") as HTMLSelectElement;
  const searchInput = document.querySelector("#search-input") as HTMLInputElement;
  const sortSelect = document.querySelector("#sort-select") as HTMLSelectElement;

  // Limit Select 이벤트 처리
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

  // Search Input 이벤트 처리
  if (searchInput) {
    // 현재 search 값으로 input 값 설정
    searchInput.value = controller.getSearch();

    // Enter 키 검색 이벤트 리스너 등록
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const searchValue = searchInput.value;

        controller.setSearch(searchValue, (updatedState) => {
          updateListPageUI(updatedState, controller);
        });
      }
    });
  }

  // Sort Select 이벤트 처리
  if (sortSelect) {
    // 현재 sort 값으로 select 값 설정
    sortSelect.value = controller.getSort();

    // sort 변경 이벤트 리스너 등록
    sortSelect.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      const newSort = target.value;

      controller.setSort(newSort, (updatedState) => {
        updateListPageUI(updatedState, controller);
      });
    });
  }
};

/**
 * 기본 ListPage 컨테이너 생성
 */
const createListPageContainer = (): string => {
  return `
    <div id="list-page-container" class="min-h-screen">
      <!-- 로딩 상태가 여기에 표시됩니다 -->
    </div>
  `;
};

export { ListPage, updateListPageUI, createListPageContainer };
