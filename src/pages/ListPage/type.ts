import { IListProps } from "../../components/List";

interface IListPageProps extends IListProps {
  loading: boolean;
  limit: number;
  search: string;
  sort: string;
  loadingMore?: boolean;
}

export type { IListPageProps };
