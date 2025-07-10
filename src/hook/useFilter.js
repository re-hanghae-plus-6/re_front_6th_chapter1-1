import { DEFAULT_LIMIT, DEFAULT_SORT } from "../constants";
import { useQueryParams } from "./useRouter";

export default function useFilter() {
  const [queryParams] = useQueryParams();

  const limit = queryParams.limit || DEFAULT_LIMIT;
  const sort = queryParams.sort || DEFAULT_SORT;
  const search = queryParams.search || "";
  const category1 = queryParams.category1 || "";
  const category2 = queryParams.category2 || "";

  return { limit, sort, search, category1, category2 };
}
