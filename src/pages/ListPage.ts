import ListLayout from "../layouts/List";
import type { IListLayoutProps } from "../layouts/List";

const ListPage = ({ products, total, loading }: IListLayoutProps) => {
  return ListLayout({ products, total, loading });
};

export default ListPage;
