import { IListProps } from "../../components/List";

interface IListPageProps extends IListProps {
  loading: boolean;
  limit: number;
  search: string;
}

export type { IListPageProps };
