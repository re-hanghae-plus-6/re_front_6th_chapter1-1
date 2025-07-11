import { getProducts } from "../../api/productApi";
import type { IListPageProps } from "./type";

export class ListPageController {
  private state: Omit<IListPageProps, "limit" | "search" | "sort"> = { products: [], total: 0, loading: false };
  private limit = 20;
  private search = "";
  private sort = "price_asc";

  async loadData(updateUI: (state: IListPageProps) => void) {
    this.state.loading = true;
    updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort });

    const data = await getProducts({
      limit: this.limit,
      search: this.search,
      sort: this.sort,
    });

    this.state.products = data.products;
    this.state.total = data.pagination.total;

    this.state.loading = false;
    updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort });
  }

  // limit 변경 메서드
  async setLimit(newLimit: number, updateUI: (state: IListPageProps) => void) {
    if (this.limit !== newLimit) {
      this.limit = newLimit;
      await this.loadData(updateUI);
    }
  }

  // search 변경 메서드
  async setSearch(newSearch: string, updateUI: (state: IListPageProps) => void) {
    const trimmedSearch = newSearch.trim();
    if (this.search !== trimmedSearch) {
      this.search = trimmedSearch;
      await this.loadData(updateUI);
    }
  }

  // sort 변경 메서드
  async setSort(newSort: string, updateUI: (state: IListPageProps) => void) {
    if (this.sort !== newSort) {
      this.sort = newSort;
      await this.loadData(updateUI);
    }
  }

  // getters
  getLimit(): number {
    return this.limit;
  }

  getSearch(): string {
    return this.search;
  }

  getSort(): string {
    return this.sort;
  }
}
