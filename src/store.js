import { getQueryParams, updateQueryParams } from "./utils/urlHelper.js";

export class ListStore {
  constructor() {
    // URL 쿼리 파라미터에서 초기 상태 읽어오기
    const urlParams = getQueryParams();
    this.state = {
      search: urlParams.search,
      limit: urlParams.limit,
      sort: urlParams.sort,
      page: 1,
    };
  }

  getState() {
    return { ...this.state };
  }

  setSearch(search) {
    this.state.search = search;
    this.state.page = 1; // 검색 시 첫 페이지로 리셋
    this.updateURL();
  }

  setLimit(limit) {
    this.state.limit = parseInt(limit);
    this.state.page = 1; // 개수 변경 시 첫 페이지로 리셋
    this.updateURL();
  }

  setSort(sort) {
    this.state.sort = sort;
    this.updateURL();
  }

  setCategory(category) {
    this.state.category = category;
    this.state.page = 1; // 카테고리 변경 시 첫 페이지로 리셋
    this.updateURL();
  }

  setPage(page) {
    this.state.page = page;
    this.updateURL();
  }

  updateURL() {
    // URL 쿼리 파라미터 업데이트
    updateQueryParams({
      search: this.state.search,
      limit: this.state.limit,
      sort: this.state.sort,
      page: this.state.page > 1 ? this.state.page : null, // 첫 페이지는 URL에서 제거
    });
  }
}

export class CategoryStore {
  constructor() {
    this.state = {
      categorys: [],
    };
  }

  getState = () => {
    return this.state;
  };

  setCategorys(categorys) {
    this.state.categorys = categorys;
  }
}
