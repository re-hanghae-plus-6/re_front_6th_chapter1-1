import { Router } from "../lib/Router";

export function useParams() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useParams: Router instance not found");
    return {};
  }

  return [router.getParams(), router.setParams];
}

export function useParam(key) {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useParam: Router instance not found");
    return undefined;
  }

  return [router.getParams(key), (value) => router.setParam(key, value)];
}

export function useQueryParams() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useQueryParams: Router instance not found");
    return {};
  }

  return [router.getQueryParams(), router.setQueryParams];
}

export function useQueryParam() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useQueryParam: Router instance not found");
    return undefined;
  }

  return (key, value) => router.setQueryParam(key, value);
}

export function useNavigate() {
  const router = Router.getInstance();
  if (!router) {
    console.warn("useNavigate: Router instance not found");
    return {
      navigate: () => {},
      currentPath: "",
    };
  }

  return {
    navigate: (to, replace = false) => router.navigate(to, replace),
    currentPath: router.getCurrentPath(),
  };
}
