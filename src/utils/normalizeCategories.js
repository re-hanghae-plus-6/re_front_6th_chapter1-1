export function normalizeCategories(raw) {
  // 이미 배열(structure OK) 이면 그대로 반환
  if (Array.isArray(raw)) return raw;

  // 객체 → [{ name, children: [...] }, ...]
  return Object.entries(raw).map(([name, childrenObj]) => ({
    name,
    children: Object.keys(childrenObj), // depth2 이름만 추출
  }));
}
