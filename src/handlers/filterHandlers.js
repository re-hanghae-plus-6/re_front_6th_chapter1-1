import { updateURL } from "../utils/url.js";
import { updateProducts, updateLimit } from "../services/productService.js";

export const handleChangeLimitSelect = async (e) => {
  const limit = parseInt(e.target.value);
  updateURL({ limit });
  await updateLimit(limit);
};

export const handleChangeCategory1Select = async (e) => {
  const sort = e.target.value;
  updateURL({ sort });
  await updateProducts({ sort });
};
