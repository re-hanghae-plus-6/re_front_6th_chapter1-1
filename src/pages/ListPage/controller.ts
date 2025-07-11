import { getProducts } from "../../api/productApi";
import type { IListPageProps } from "./type";

export class ListPageController {
  private state: Omit<IListPageProps, "limit"> = { products: [], total: 0, loading: false };
  private limit = 20;

  async loadData(updateUI: (state: IListPageProps) => void) {
    this.state.loading = true;
    updateUI({ ...this.state, limit: this.limit });

    const data = await getProducts({ limit: this.limit });
    this.state.products = data.products;
    this.state.total = data.pagination.total;

    this.state.loading = false;
    updateUI({ ...this.state, limit: this.limit });
  }

  // limit 변경 메서드 추가
  async setLimit(newLimit: number, updateUI: (state: IListPageProps) => void) {
    if (this.limit !== newLimit) {
      this.limit = newLimit;
      await this.loadData(updateUI);
    }
  }

  // 현재 limit 값을 반환하는 getter
  getLimit(): number {
    return this.limit;
  }
}
