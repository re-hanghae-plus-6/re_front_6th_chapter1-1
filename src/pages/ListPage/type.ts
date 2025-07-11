import { IListProps } from "../../components/List";

interface IListPageProps extends IListProps {
  loading: boolean;
  limit: number;
  search: string;
  sort: string;
}

export type { IListPageProps };
