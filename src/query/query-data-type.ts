export type QueryDataType<T> = {
  isLoading: boolean;
  data: T;
  error?: string | null;
  page?: number;
  limit?: number;
};
