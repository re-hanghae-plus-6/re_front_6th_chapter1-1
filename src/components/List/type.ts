import { IListItemProps } from "./ListItem";

interface IListProps {
  products: IListItemProps[];
  total: number;
  search?: string;
}

export type { IListProps };
