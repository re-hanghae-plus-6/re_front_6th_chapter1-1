import { IListItemProps } from "./ListItem";

interface IListProps {
  products: IListItemProps[];
  total: number;
}

export type { IListProps };
