import { LoadingList, List } from "../../components/List";
import type { IListLayoutProps } from "./type";

const ListLayout = ({ products, total, loading }: IListLayoutProps) => {
  return loading ? LoadingList : List({ products, total });
};

export default ListLayout;
