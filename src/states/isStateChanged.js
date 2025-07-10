export function isStateChanged(prev, cur) {
  return (
    (prev.sort !== cur.sort ||
      prev.search !== cur.search ||
      prev.category1 !== cur.category1 ||
      prev.category2 !== cur.category2 ||
      prev.limit !== cur.limit) &&
    !cur.isLoading
  );
}
