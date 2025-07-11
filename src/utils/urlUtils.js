export default function urlUtils() {
  return {
    navigateTo: (to, qs) => {
      const currentUrl = new URL(location.href);
      if (to.startsWith("/")) {
        currentUrl.pathname = to;
      } else {
        currentUrl.pathname += "/" + to;
      }

      if (qs) currentUrl.searchParams = new URLSearchParams(qs);

      history.pushState(currentUrl);
    },
  };
}
