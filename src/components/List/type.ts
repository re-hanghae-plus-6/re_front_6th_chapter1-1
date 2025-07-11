import { IListItemProps } from "./ListItem";

interface IListProps {
  products: IListItemProps[];
  total: number;
  search?: string;
  sort?: string;
  loadingMore?: boolean;
  hasMore?: boolean;
}

export type { IListProps };
