// routes에 적은 path를 정규식으로 변환 -> location.pathname이랑 비교가 가능하게끔
export function pathToRegex(path) {
  // "/product/:id" → /^\/product\/([^/]+)$/
  return new RegExp("^" + path.replace(/:\w+/g, "([^/]+)").replace("*", ".*") + "$");
}
