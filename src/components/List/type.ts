import { IListItemProps } from "./ListItem";

interface IListProps {
  products: IListItemProps[];
  total: number;
  search?: string;
  sort?: string;
}

export type { IListProps };
