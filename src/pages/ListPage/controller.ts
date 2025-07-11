import { getProducts } from "../../api/productApi";
import type { IListPageProps } from "./type";

export class ListPageController {
  private state = { products: [], total: 0, loading: false };

  async loadData(updateUI: (state: IListPageProps) => void) {
    this.state.loading = true;
    updateUI(this.state);

    const data = await getProducts({ limit: 20 });

    this.state.products = data.products;
    this.state.total = data.pagination.total;

    this.state.loading = false;
    updateUI(this.state);
  }
}
