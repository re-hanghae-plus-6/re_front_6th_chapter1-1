export const getUrlSegment = (pathname, index) => {
  const segments = pathname.split("/").filter((segment) => segment !== "");
  return segments[index] || null;
};

export const getProductId = (pathname) => {
  return getUrlSegment(pathname, 1);
};
