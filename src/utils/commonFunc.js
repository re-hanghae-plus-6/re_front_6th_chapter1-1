export const commonFunc = (() => {
  const isDetailFunc = (url) => {
    const urlObj = new URL(url, window.location.origin);
    const isDetail = /^\/product\/([^\/]+)$/.test(urlObj.pathname);
    return isDetail;
  };

  return {
    isDetailFunc,
  };
})();
