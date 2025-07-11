export const BASE_PATH = (() => {
  if (process.env.NODE_ENV === "production") {
    return "/front_6th_chapter1-1";
  }

  return "";
})();
