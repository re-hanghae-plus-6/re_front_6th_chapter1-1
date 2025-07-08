export class Store {
  constructor() {
    this.state = {
      limit: 20,
      page: 1,
      search: "",
      sort: "price_asc",
      category1: "",
      category2: "",
    };
  }

  getState = () => {
    return this.state;
  };

  setLimit = (limit) => {
    return (this.state.limit = limit);
  };

  setPage = (page) => {
    return (this.state.page = page);
  };

  setSort = (sort) => {
    return (this.state.sort = sort);
  };

  setSearch = (search) => {
    return (this.state.search = search);
  };

  setCategory1 = (category1) => {
    return (this.state.category1 = category1);
  };

  setCategory2 = (category2) => {
    return (this.state.category2 = category2);
  };
}
