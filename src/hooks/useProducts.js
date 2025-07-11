import { useState } from "./useState.js";
import { getProducts, getCategories } from "../api/productApi.js";

export function useProducts(callback) {
  const productsState = useState({
    products: [],
    categories: {},
    isLoading: false,
    isLoadingMore: false,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  });

  let unsubscribe = null;
  if (callback) {
    unsubscribe = productsState.subscribe(callback);
  }

  const loadProducts = async (params = {}) => {
    productsState.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const response = await getProducts(params);

    productsState.setState((prevState) => ({
      ...prevState,
      products: response.products || [],
      isLoading: false,
      pagination: response.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    }));
  };

  const loadMoreProducts = async (params = {}) => {
    const current = productsState.getState();

    if (current.isLoadingMore || !current.pagination.hasNext) {
      return;
    }

    productsState.setState((prevState) => ({
      ...prevState,
      isLoadingMore: true,
    }));

    const response = await getProducts({
      ...params,
      page: current.pagination.page + 1,
    });

    productsState.setState((prevState) => ({
      ...prevState,
      products: [...prevState.products, ...(response.products || [])],
      pagination: response.pagination || prevState.pagination,
      isLoadingMore: false,
    }));
  };

  const loadCategories = async () => {
    productsState.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const response = await getCategories();

    productsState.setState((prevState) => ({
      ...prevState,
      categories: response || {},
    }));
  };

  const loadInitialData = async (params = {}) => {
    productsState.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    await Promise.all([loadCategories(), loadProducts(params)]);
  };

  const destroy = () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };

  return {
    ...productsState.getState(),
    loadInitialData,
    loadProducts,
    loadCategories,
    loadMoreProducts,
    destroy,
  };
}
